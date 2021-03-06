/// <reference path="RawExpression.ts" />
/// <reference path="UntypedUnary.ts" />
/// <reference path="UntypedBinary.ts" />
/// <reference path="Primitive.ts" />

type UnaryInlinedExpression = {
    Type: "Unary",
    Operator: UntypedUnary,
    Operand: InlinedExpression
    StartIndex: number
    EndIndex: number
}

type BinaryInlinedExpression = {
    Type: "Binary",
    Operator: UntypedBinary,
    Left: InlinedExpression
    Right: InlinedExpression
    StartIndex: number
    EndIndex: number
}

type LetStatementWithoutIdentifierInlinedExpression = {
    Type: "LetWithoutIdentifier"
    StartIndex: number
    EndIndex: number
    Then: InlinedExpression
}

type LetStatementIncorrectIdentifierTypeInlinedExpression = {
    Type: "LetIncorrectIdentifierType"
    StartIndex: number
    EndIndex: number
    ActualType: string
    Value: InlinedExpression
    Then: InlinedExpression
}

type LetStatementInlinedExpression = {
    Type: "Let"
    StartIndex: number
    EndIndex: number
    Name: string
    NameStartIndex: number
    NameEndIndex: number
    Value: InlinedExpression
    Then: InlinedExpression
}

type LetStatementNameNotUniqueInlinedExpression = {
    Type: "LetNameNotUnique"
    StartIndex: number
    EndIndex: number
    Name: string
    NameStartIndex: number
    NameEndIndex: number
    Value: InlinedExpression
    Then: InlinedExpression
}

type ReturnStatementInlinedExpression = {
    Type: "Return"
    StartIndex: number
    EndIndex: number
    Value: InlinedExpression
}

type LambdaInlinedExpression = {
    Type: "Lambda"
    StartIndex: number
    EndIndex: number
    Name: string
    NameStartIndex: number
    NameEndIndex: number
    Body: RawExpression
    Scope: Scope
}

type LambdaStatementWithoutIdentifierInlinedExpression = {
    Type: "LambdaWithoutIdentifier"
    StartIndex: number
    EndIndex: number
    Body: InlinedExpression
}

type LambdaStatementIncorrectIdentifierTypeInlinedExpression = {
    Type: "LambdaIncorrectIdentifierType"
    StartIndex: number
    EndIndex: number
    ActualType: string
    NameStartIndex: number
    NameEndIndex: number
    Body: InlinedExpression
}

type LambdaNameNotUniqueInlinedExpression = {
    Type: "LambdaNameNotUnique"
    StartIndex: number
    EndIndex: number
    Name: string
    NameStartIndex: number
    NameEndIndex: number
    Body: RawExpression
    Scope: Scope
}

type ReferenceInlinedExpression = {
    Type: "Reference"
    StartIndex: number
    EndIndex: number
    Name: string
    Value: InlinedExpression
}

type ReferenceUndefinedInlinedExpression = {
    Type: "ReferenceUndefined"
    StartIndex: number
    EndIndex: number
    Name: string
}

type CallExpression = {
    Type: "Call"
    Lambda: RawExpression
    Argument: InlinedExpression
    Result: InlinedExpression
    StartIndex: number
    EndIndex: number
}

type CallLambdaExpectedExpression = {
    Type: "CallLambdaExpected"
    Value: InlinedExpression
    StartIndex: number
    EndIndex: number
}

type GetItemInlinedExpression = {
    Type: "GetItem"
    Item: number
    Of: InlinedExpression
    StartIndex: number
    EndIndex: number
}

type ParameterInlinedExpression = {
    Type: "Parameter"
    Name: string
    Primitive: Primitive
    Plurality: number
    StartIndex: number
    EndIndex: number
}

type InlinedExpression = UnknownExpression | BooleanExpression | IntegerExpression | BinaryInlinedExpression | UnaryInlinedExpression | LetStatementInlinedExpression | LetStatementWithoutIdentifierInlinedExpression | LetStatementIncorrectIdentifierTypeInlinedExpression | LetStatementNameNotUniqueInlinedExpression | ReturnStatementInlinedExpression | NextStatementNotFoundExpression | LambdaInlinedExpression | LambdaStatementWithoutIdentifierInlinedExpression | LambdaStatementIncorrectIdentifierTypeInlinedExpression | LambdaNameNotUniqueInlinedExpression | ReferenceInlinedExpression | ReferenceUndefinedInlinedExpression | CallExpression | CallLambdaExpectedExpression | GetItemInlinedExpression | ParameterInlinedExpression | FloatExpression

type Scope = { [name: string]: InlinedExpression }