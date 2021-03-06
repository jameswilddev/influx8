/// <reference path="RawExpression.ts" />
/// <reference path="ParenthesizeTokens.ts" />
/// <reference path="ParseConstantExpression.ts" />
/// <reference path="ParseOperatorExpression.ts" />
/// <reference path="ParseParenthesesExpression.ts" />
/// <reference path="ParseReferenceExpression.ts" />
/// <reference path="ParseGetItemExpression.ts" />

function TryParseExpression(tokens: ParenthesizedToken[]): RawExpression | undefined {
    return ParseConstantExpression(tokens) || ParseParenthesesExpression(tokens) || ParseOperatorExpression(tokens) || ParseReferenceExpression(tokens) || ParseGetItemExpression(tokens) || undefined
}