type BooleanExpression = {
    Type: "Boolean"
    StartIndex: number
    Value: boolean
}

type IntegerExpression = {
    Type: "Integer"
    StartIndex: number
    Value: number
}

type UnknownExpression = {
    Type: "Unknown"
    StartIndex: number
    EndIndex: number
    Tokens: ParenthesizedToken[]
}

type NextStatementNotFoundExpression = {
    Type: "NextStatementNotFound"
    Tokens: ParenthesizedToken[]
}

type UnaryRawExpression = {
    Type: "Unary",
    Operator: UntypedUnary,
    Operand: RawExpression
}

type BinaryRawExpression = {
    Type: "Binary",
    Operator: UntypedBinary,
    Left: RawExpression
    Right: RawExpression
}

type LetStatementWithoutIdentifierRawExpression = {
    Type: "LetWithoutIdentifier"
    StartIndex: number
    EndIndex: number
    Then: RawExpression
}

type LetStatementIncorrectIdentifierTypeRawExpression = {
    Type: "LetIncorrectIdentifierType"
    StartIndex: number
    EndIndex: number
    ActualType: string
    Value: RawExpression
    Then: RawExpression
}

type LetStatementRawExpression = {
    Type: "Let"
    StartIndex: number
    EndIndex: number
    Name: string
    NameStartIndex: number
    NameEndIndex: number
    Value: RawExpression
    Then: RawExpression
}

type ReturnStatementRawExpression = {
    Type: "Return"
    StartIndex: number
    EndIndex: number
    Value: RawExpression
}

type LambdaRawExpression = {
    Type: "Lambda"
    StartIndex: number
    EndIndex: number
    Name: string
    NameStartIndex: number
    NameEndIndex: number
    Body: RawExpression
}

type LambdaStatementWithoutIdentifierRawExpression = {
    Type: "LambdaWithoutIdentifier"
    StartIndex: number
    EndIndex: number
    Body: RawExpression
}

type LambdaStatementIncorrectIdentifierTypeRawExpression = {
    Type: "LambdaIncorrectIdentifierType"
    StartIndex: number
    EndIndex: number
    ActualType: string
    NameStartIndex: number
    NameEndIndex: number
    Body: RawExpression
}

type RawExpression = UnknownExpression | BooleanExpression | IntegerExpression | BinaryRawExpression | UnaryRawExpression | LetStatementRawExpression | LetStatementWithoutIdentifierRawExpression | LetStatementIncorrectIdentifierTypeRawExpression | ReturnStatementRawExpression | NextStatementNotFoundExpression | LambdaRawExpression | LambdaStatementWithoutIdentifierRawExpression | LambdaStatementIncorrectIdentifierTypeRawExpression