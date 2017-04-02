/// <reference path="SplitByWhiteSpace.ts" />

type BooleanToken = {
    Type: "Boolean"
    StartIndex: number
    EndIndex: number
    Value: boolean
}

function ParseBoolean(token: UntypedToken): BooleanToken | undefined {
    switch (token.Text) {
        case "false": return {
            Type: "Boolean",
            StartIndex: token.StartIndex,
            EndIndex: token.StartIndex + token.Text.length - 1,
            Value: false
        }
        case "true": return {
            Type: "Boolean",
            StartIndex: token.StartIndex,
            EndIndex: token.StartIndex + token.Text.length - 1,
            Value: true
        }
        default: return undefined
    }
}