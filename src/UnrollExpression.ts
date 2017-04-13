/// <reference path="UnrolledExpression.ts" />

function UnrollExpression(expression: InlinedExpression): UnrolledExpression[] {
    switch (expression.Type) {
        case "Boolean":
        case "Integer":
        case "Unknown":
        case "NextStatementNotFound":
        case "Lambda":
        case "LambdaNameNotUnique":
        case "CallLambdaExpected":
            return [expression]

        case "Unary": {
            const operand = UnrollExpression(expression.Operand)
            const output: UnrolledExpression[] = []
            for (const dimension of operand) output.push({
                Type: "Unary",
                Operator: expression.Operator,
                Operand: dimension
            })
            return output
        }

        case "Binary": {
            const left = UnrollExpression(expression.Left)
            const right = UnrollExpression(expression.Right)
            const output: UnrolledExpression[] = []
            if (expression.Operator == "Concatenate") {
                for (const dimension of left) output.push({
                    Type: "ConcatenateLeft",
                    Value: dimension
                })
                for (const dimension of right) output.push({
                    Type: "ConcatenateRight",
                    Value: dimension
                })
            } else if (left.length == 1) {
                for (const dimension of right) output.push({
                    Type: "Binary",
                    Operator: expression.Operator,
                    Left: left[0],
                    Right: dimension
                })
            } else if (right.length == 1) {
                for (const dimension of left) output.push({
                    Type: "Binary",
                    Operator: expression.Operator,
                    Left: dimension,
                    Right: right[0]
                })
            } else if (left.length == right.length) {
                for (let i = 0; i < left.length; i++) output.push({
                    Type: "Binary",
                    Operator: expression.Operator,
                    Left: left[i],
                    Right: right[i]
                })
            } else return [{
                Type: "BinaryInconsistentPlurality",
                Operator: expression.Operator,
                Left: left,
                Right: right
            }]

            return output
        }

        case "Return": {
            const value = UnrollExpression(expression.Value)
            const output: UnrolledExpression[] = []
            for (const dimension of value) output.push({
                Type: "Return",
                StartIndex: expression.StartIndex,
                EndIndex: expression.EndIndex,
                Value: dimension
            })
            return output
        }

        case "Reference": {
            const value = UnrollExpression(expression.Value)
            const output: UnrolledExpression[] = []
            for (const dimension of value) output.push({
                Type: "Reference",
                StartIndex: expression.StartIndex,
                EndIndex: expression.EndIndex,
                Name: expression.Name,
                Value: dimension
            })
            return output
        }

        case "ReferenceUndefined": return [{
            Type: "ReferenceUndefined",
            StartIndex: expression.StartIndex,
            EndIndex: expression.EndIndex,
            Name: expression.Name
        }]

        case "Let": {
            const then = UnrollExpression(expression.Then)
            const output: UnrolledExpression[] = []
            for (const dimension of then) output.push({
                Type: "Let",
                StartIndex: expression.StartIndex,
                EndIndex: expression.EndIndex,
                Name: expression.Name,
                NameStartIndex: expression.NameStartIndex,
                NameEndIndex: expression.NameEndIndex,
                Value: expression.Value,
                Then: dimension
            })
            return output
        }

        case "LetNameNotUnique": {
            const then = UnrollExpression(expression.Then)
            const output: UnrolledExpression[] = []
            for (const dimension of then) output.push({
                Type: "LetNameNotUnique",
                StartIndex: expression.StartIndex,
                EndIndex: expression.EndIndex,
                Name: expression.Name,
                NameStartIndex: expression.NameStartIndex,
                NameEndIndex: expression.NameEndIndex,
                Value: expression.Value,
                Then: dimension
            })
            return output
        }

        case "LetIncorrectIdentifierType": {
            const then = UnrollExpression(expression.Then)
            const output: UnrolledExpression[] = []
            for (const dimension of then) output.push({
                Type: "LetIncorrectIdentifierType",
                StartIndex: expression.StartIndex,
                EndIndex: expression.EndIndex,
                ActualType: expression.ActualType,
                Value: expression.Value,
                Then: dimension
            })
            return output
        }

        case "LetWithoutIdentifier": {
            const then = UnrollExpression(expression.Then)
            const output: UnrolledExpression[] = []
            for (const dimension of then) output.push({
                Type: "LetWithoutIdentifier",
                StartIndex: expression.StartIndex,
                EndIndex: expression.EndIndex,
                Then: dimension
            })
            return output
        }

        case "LambdaWithoutIdentifier": {
            const body = UnrollExpression(expression.Body)
            const output: UnrolledExpression[] = []
            for (const dimension of body) output.push({
                Type: "LambdaWithoutIdentifier",
                StartIndex: expression.StartIndex,
                EndIndex: expression.EndIndex,
                Body: dimension
            })
            return output
        }

        case "LambdaIncorrectIdentifierType": {
            const body = UnrollExpression(expression.Body)
            const output: UnrolledExpression[] = []
            for (const dimension of body) output.push({
                Type: "LambdaIncorrectIdentifierType",
                StartIndex: expression.StartIndex,
                EndIndex: expression.EndIndex,
                ActualType: expression.ActualType,
                NameStartIndex: expression.NameStartIndex,
                NameEndIndex: expression.NameEndIndex,
                Body: dimension
            })
            return output
        }

        case "Call": {
            const result = UnrollExpression(expression.Result)
            const output: UnrolledExpression[] = []
            for (const dimension of result) output.push({
                Type: "Call",
                Lambda: expression.Lambda,
                Argument: expression.Argument,
                Result: dimension
            })
            return output
        }
    }
}