/// <reference path="WorkerMessages.ts" />
/// <reference path="../Compiler/ParenthesizeTokens.ts" />
/// <reference path="../Compiler/ParseExpression.ts" />
/// <reference path="../Compiler/InlineExpression.ts" />
/// <reference path="../Compiler/UnrollExpression.ts" />
/// <reference path="../Compiler/TypecheckExpression.ts" />
/// <reference path="../Compiler/VerifyExpression.ts" />

addEventListener("message", e => {
    const request = e.data as WorkerConfigurationRequest | WorkerBuildRequest
    if (request.Type == "Configuration")
        HandleConfiguration(request)
    else
        HandleBuild(request)
})

const TaskWorkers: Worker[] = []

function CreateTaskWorker(task: WorkerConfigurationRequestTask, index: number): void {
    const worker = new Worker(task.WorkerUrl)
    worker.addEventListener("message", e => {
        const workerResponse = e.data as TaskResponse
        const response: TaskCompletedWorkerResponse = {
            Type: "TaskCompleted",
            TaskIndex: index,
            BuildId: workerResponse.BuildId,
            Data: workerResponse.Data
        };
        // todo: Why does this not accept the typing information we specified in the tsconfig, and use the browser postMessage?
        (postMessage as any)(response)
    })
    TaskWorkers.push(worker)
}

function HandleConfiguration(request: WorkerConfigurationRequest) {
    for (let i = 0; i < request.Tasks.length; i++) CreateTaskWorker(request.Tasks[i], i)
}

function PostProgress(request: WorkerBuildRequest, stage: BuildStage) {
    const response: ProgressWorkerResponse = {
        Type: "Progress",
        Stage: stage,
        BuildId: request.BuildId
    };
    // todo: Why does this not accept the typing information we specified in the tsconfig, and use the browser postMessage?
    (postMessage as any)(response)
}

function HandleBuild(request: WorkerBuildRequest) {
    PostProgress(request, "Parenthesizing")
    const parenthesized = ParenthesizeTokens(request.Tokens)
    PostProgress(request, "Parsing")
    const expression = ParseExpression(parenthesized, 0, request.SourceLength)
    PostProgress(request, "Inlining")
    const inlined = InlineExpression(expression, {})
    PostProgress(request, "Unrolling")
    const unrolled = UnrollExpression(inlined)
    PostProgress(request, "Typechecking")
    const typechecked: TypecheckedExpression[] = []
    for (const dimension of unrolled) typechecked.push(TypecheckExpression(dimension))
    PostProgress(request, "Verifying")
    const verified: VerifiedExpression[] = []
    for (const dimension of typechecked) {
        const verifiedDimension = VerifyExpression(dimension)
        if (!verifiedDimension) break
        verified.push(verifiedDimension)
    }
    PostProgress(request, "RunningTasks")
    const taskRequest: TaskRequest = {
        BuildId: request.BuildId,
        Typechecked: typechecked,
        Verified: verified.length == typechecked.length ? verified : undefined
    }
    for (const worker of TaskWorkers) worker.postMessage(taskRequest)
}