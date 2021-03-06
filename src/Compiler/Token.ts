type UntypedToken = {
    StartIndex: number
    Text: string
}

type BooleanToken = {
    Type: "Boolean"
    StartIndex: number
    EndIndex: number
    Value: boolean
}

type IntegerToken = {
    Type: "Integer"
    StartIndex: number
    EndIndex: number
    Value: number
}

type FloatToken = {
    Type: "Float"
    StartIndex: number
    EndIndex: number
    Value: number
}

type IdentifierToken = {
    Type: "Identifier"
    StartIndex: number
    EndIndex: number
    Value: string
}

type SymbolTokenType = "OpeningParenthesis" | "ClosingParenthesis" | "Operator" | "Statement" | "Lambda" | "GetItem"

type SymbolToken = {
    Type: SymbolTokenType
    StartIndex: number
    EndIndex: number
    Symbol: string
}

type UnknownToken = {
    Type: "Unknown"
    StartIndex: number
    EndIndex: number
    Text: string
}

type UnparenthesizedToken = BooleanToken | IntegerToken | FloatToken | IdentifierToken | SymbolToken | UnknownToken

type ParenthesesToken = {
    Type: "Parentheses"
    StartIndex: number
    EndIndex: number
    Contents: ParenthesizedToken[]
}

type UnopenedParenthesisToken = {
    Type: "UnopenedParenthesis"
    StartIndex: number
    EndIndex: number
}

type UnclosedParenthesisToken = {
    Type: "UnclosedParenthesis"
    StartIndex: number
    EndIndex: number
}

type ParenthesizedToken = UnparenthesizedToken | ParenthesesToken | UnopenedParenthesisToken | UnclosedParenthesisToken