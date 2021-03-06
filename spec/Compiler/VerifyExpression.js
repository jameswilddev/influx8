describe("VerifyExpression", () => {
    const Namespace = require("rewire")("../../Exports.js")
    const VerifyExpression = Namespace.__get__("VerifyExpression")

    function Test(description, input, output, verifyExpression) {
        it(description, () => {
            Namespace.__set__("VerifyExpression", verifyExpression || fail)
            expect(VerifyExpression(input)).toEqual(output)
        })
    }

    Test("boolean", {
        Type: "Boolean",
        StartIndex: 32,
        EndIndex: 48,
        Value: "Irrelevant"
    }, {
            Type: "Boolean",
            Value: "Irrelevant"
        })

    Test("integer", {
        Type: "Integer",
        StartIndex: 32,
        EndIndex: 48,
        Value: "Irrelevant"
    }, {
            Type: "Integer",
            Value: "Irrelevant"
        })

    Test("float", {
        Type: "Float",
        StartIndex: 32,
        EndIndex: 48,
        Value: "Irrelevant"
    }, {
            Type: "Float",
            Value: "Irrelevant"
        })

    Test("unknown", {
        Type: "Unknown",
        StartIndex: 32,
        EndIndex: 48,
        Tokens: "Irrelevant"
    }, undefined)

    Test("next statement not found", {
        Type: "NextStatementNotFound",
        Tokens: "Irrelevant",
        StartIndex: 32,
        EndIndex: 48
    }, undefined)

    Test("unary unmatched", {
        Type: "UnaryUnmatched",
        Operator: "Any Operator",
        Operand: "Any Operand",
        StartIndex: 32,
        EndIndex: 48
    }, undefined)

    Test("unary operand valid", {
        Type: "Unary",
        Operator: "Any Operator",
        Operand: "Any Operand",
        StartIndex: 32,
        EndIndex: 48
    }, {
            Type: "Unary",
            Operator: "Any Operator",
            Operand: "Recursed Operand"
        }, (expression) => {
            expect(expression).toEqual("Any Operand")
            return "Recursed Operand"
        })

    Test("unary operand invalid", {
        Type: "Unary",
        Operator: "Any Operator",
        Operand: "Any Operand",
        StartIndex: 32,
        EndIndex: 48
    }, undefined, (expression) => {
        expect(expression).toEqual("Any Operand")
        return undefined
    })

    Test("binary unmatched", {
        Type: "BinaryUnmatched",
        Operator: "Any Operator",
        Left: "Any Left Operand",
        Right: "Any Right Operand",
        StartIndex: 32,
        EndIndex: 48
    })

    Test("binary both operands valid", {
        Type: "Binary",
        Operator: "Any Operator",
        Left: "Any Left Operand",
        Right: "Any Right Operand",
        StartIndex: 32,
        EndIndex: 48
    }, {
            Type: "Binary",
            Operator: "Any Operator",
            Left: "Recursed Left Operand",
            Right: "Recursed Right Operand"
        }, (expression) => {
            switch (expression) {
                case "Any Left Operand": return "Recursed Left Operand"
                case "Any Right Operand": return "Recursed Right Operand"
                default: fail("Unexpected expression")
            }
        })

    Test("binary left valid", {
        Type: "Binary",
        Operator: "Any Operator",
        Left: "Any Left Operand",
        Right: "Any Right Operand",
        StartIndex: 32,
        EndIndex: 48
    }, undefined, (expression) => {
        switch (expression) {
            case "Any Left Operand": return "Recursed Left Operand"
            case "Any Right Operand": return undefined
            default: fail("Unexpected expression")
        }
    })

    Test("binary right operand valid", {
        Type: "Binary",
        Operator: "Any Operator",
        Left: "Any Left Operand",
        Right: "Any Right Operand",
        StartIndex: 32,
        EndIndex: 48
    }, undefined, (expression) => {
        switch (expression) {
            case "Any Left Operand": return undefined
            case "Any Right Operand": return "Recursed Right Operand"
            default: fail("Unexpected expression")
        }
    })

    Test("binary neither operand valid", {
        Type: "Binary",
        Operator: "Any Operator",
        Left: "Any Left Operand",
        Right: "Any Right Operand",
        StartIndex: 32,
        EndIndex: 48
    }, undefined, (expression) => {
        switch (expression) {
            case "Any Left Operand": return undefined
            case "Any Right Operand": return undefined
            default: fail("Unexpected expression")
        }
    })

    Test("let", {
        Type: "Let",
        StartIndex: 56,
        EndIndex: 63,
        Name: "Test Name",
        NameStartIndex: 32,
        NameEndIndex: 41,
        Value: "Test Value",
        Then: "Test Then"
    }, "Test Recursed Then", (expression) => {
        expect(expression).toEqual("Test Then")
        return "Test Recursed Then"
    })

    Test("let name not unique", {
        Type: "LetNameNotUnique",
        StartIndex: 56,
        EndIndex: 63,
        Name: "Test Name",
        NameStartIndex: 32,
        NameEndIndex: 41,
        Value: "Test Value",
        Then: "Test Then"
    }, "Test Recursed Then", (expression) => {
        expect(expression).toEqual("Test Then")
        return "Test Recursed Then"
    })

    Test("let without identifier", {
        Type: "LetWithoutIdentifier",
        StartIndex: 56,
        EndIndex: 63,
        Then: "Test Then"
    }, "Test Recursed Then", (expression) => {
        expect(expression).toEqual("Test Then")
        return "Test Recursed Then"
    })

    Test("let incorrect identifier type", {
        Type: "LetIncorrectIdentifierType",
        StartIndex: 56,
        EndIndex: 63,
        ActualType: "Test Actual Type",
        Value: "Test Value",
        Then: "Test Then"
    }, "Test Recursed Then", (expression) => {
        expect(expression).toEqual("Test Then")
        return "Test Recursed Then"
    })

    Test("return", {
        Type: "Return",
        StartIndex: 56,
        EndIndex: 63,
        Value: "Test Value"
    }, "Test Recursed Value", (expression) => {
        expect(expression).toEqual("Test Value")
        return "Test Recursed Value"
    })

    Test("lambda", {
        Type: "Lambda",
        StartIndex: 56,
        EndIndex: 63,
        Name: "Test Name",
        NameStartIndex: 32,
        NameEndIndex: 41,
        Body: "Test Uninlined Body",
        Scope: {
            "test scope key a": "test scope value a",
            "test scope key b": "test scope value b",
            "test scope key c": "test scope value c"
        }
    }, undefined, undefined)

    Test("lambda without identifier", {
        Type: "LambdaWithoutIdentifier",
        StartIndex: 32,
        EndIndex: 48,
        Body: "Test Body"
    }, undefined)

    Test("lambda incorrect identifier type", {
        Type: "LambdaIncorrectIdentifierType",
        StartIndex: 56,
        EndIndex: 63,
        Name: "Test Name",
        NameStartIndex: 32,
        NameEndIndex: 41,
        Body: "Test Body"
    }, undefined)

    Test("lambda name not unique", {
        Type: "LambdaNameNotUnique",
        StartIndex: 56,
        EndIndex: 63,
        Name: "test scope key b",
        NameStartIndex: 32,
        NameEndIndex: 41,
        Body: "Test Uninlined Body",
        Scope: {
            "test scope key a": "test scope value a",
            "test scope key b": "test scope value b",
            "test scope key c": "test scope value c"
        }
    }, undefined)

    Test("reference", {
        Type: "Reference",
        StartIndex: 32,
        EndIndex: 48,
        Name: "Test Name",
        Value: "Test Value"
    }, "Test Recursed Value", (expression) => {
        expect(expression).toEqual("Test Value")
        return "Test Recursed Value"
    })

    Test("reference undefined", {
        Type: "ReferenceUndefined",
        StartIndex: 32,
        EndIndex: 48,
        Name: "Irrelevant"
    }, undefined)

    Test("lambda expected", {
        Type: "CallLambdaExpected",
        Value: "Irrelevant",
        StartIndex: 32,
        EndIndex: 48
    }, undefined)

    Test("call", {
        Type: "Call",
        Lambda: "Test Lambda",
        Argument: "Test Argument",
        Result: "Test Result",
        StartIndex: 32,
        EndIndex: 48
    }, "Test Recursed Result", (expression) => {
        expect(expression).toEqual("Test Result")
        return "Test Recursed Result"
    })

    Test("concatenate left", {
        Type: "ConcatenateLeft",
        Value: "Test Value",
        StartIndex: 32,
        EndIndex: 48
    }, "Test Recursed Value", (expression) => {
        expect(expression).toEqual("Test Value")
        return "Test Recursed Value"
    })

    Test("concatenate right", {
        Type: "ConcatenateRight",
        Value: "Test Value",
        StartIndex: 32,
        EndIndex: 48
    }, "Test Recursed Value", (expression) => {
        expect(expression).toEqual("Test Value")
        return "Test Recursed Value"
    })

    Test("binary inconsistent plurality", {
        Type: "BinaryInconsistentPlurality",
        Operator: "Test Operator",
        Left: ["Test Left A", "Test Left B", "Test Left C"],
        Right: ["Test Right A", "Test Right B", "Test Right C", "Test Right D"],
        StartIndex: 32,
        EndIndex: 48
    }, undefined)

    Test("get item", {
        Type: "GetItem",
        Item: "Test Item",
        Of: "Test Of",
        Value: "Test Value",
        StartIndex: 32,
        EndIndex: 48
    }, "Test Recursed Value", (expression) => {
        expect(expression).toEqual("Test Value")
        return "Test Recursed Value"
    })

    Test("get item out of range", {
        Type: "GetItemOutOfRange",
        Item: "Test Item",
        Of: "Test Of",
        StartIndex: 32,
        EndIndex: 48
    }, undefined)

    Test("parameter", {
        Type: "Parameter",
        Name: "Test Name",
        Primitive: "Test Primitive",
        Item: 7,
        Plurality: 10,
        StartIndex: 32,
        EndIndex: 48
    }, {
            Type: "Parameter",
            Name: "Test Name",
            Primitive: "Test Primitive",
            Item: 7,
            Plurality: 10
        })
})