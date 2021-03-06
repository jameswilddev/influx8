/// <reference path="CSyntax.ts" />

function GenerateCSyntax<TUnary extends string, TBinary extends string, TFunction extends string>(expression: CSyntaxMatch<TUnary, TBinary, TFunction>, syntax: CSyntax<TUnary, TBinary, TFunction>): string {
    switch (expression.Type) {
        case "Boolean":
        case "Integer":
            return JSON.stringify(expression.Value)

        case "Float": {
            // TODO: How will NaN/infinity work here?
            const output = JSON.stringify(expression.Value)
            if (output.indexOf(".") == -1) return output + ".0"
            return output
        }

        case "Unary":
            return `(${syntax.UnarySymbolsOrKeywords[expression.Operator]}${GenerateCSyntax(expression.Operand, syntax)})`

        case "Binary":
            return `(${GenerateCSyntax(expression.Left, syntax)} ${syntax.BinarySymbolsOrKeywords[expression.Operator]} ${GenerateCSyntax(expression.Right, syntax)})`

        case "Function": {
            let output = `${syntax.FunctionSymbolsOrKeywords[expression.Function]}(`
            let first = true
            for (const argument of expression.Arguments) {
                if (!first) output += ", "
                first = false
                output += GenerateCSyntax(argument, syntax)
            }
            output += ")"
            return output
        }

        case "Property":
            return `${GenerateCSyntax(expression.Of, syntax)}.${expression.Name}`

        case "Reference":
            return expression.Name

        case "Block": {
            const recursed: string[] = []
            for (const item of expression.Contents) recursed.push(GenerateCSyntax(item, syntax))
            return `${expression.Opener}${recursed.join(expression.Delimiter)}${expression.Closer}`
        }
    }
}