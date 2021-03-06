describe("UnrollExpression", () => {
    const Namespace = require("rewire")("../../Exports.js")
    const UnrollExpression = Namespace.__get__("UnrollExpression")

    function Test(description, expression, output, unrollExpression) {
        it(description, () => {
            Namespace.__set__("UnrollExpression", unrollExpression || fail)
            expect(UnrollExpression(expression)).toEqual(output)
        })
    }

    Test("call", {
        Type: "Call",
        Lambda: "Test Lambda",
        Argument: "Test Argument",
        Result: "Test Result",
        StartIndex: 32,
        EndIndex: 48
    }, [{
        Type: "Call",
        Lambda: "Test Lambda",
        Argument: "Test Recursed Argument",
        Result: "Test Recursed Result A",
        StartIndex: 32,
        EndIndex: 48
    }, {
        Type: "Call",
        Lambda: "Test Lambda",
        Argument: "Test Recursed Argument",
        Result: "Test Recursed Result B",
        StartIndex: 32,
        EndIndex: 48
    }, {
        Type: "Call",
        Lambda: "Test Lambda",
        Argument: "Test Recursed Argument",
        Result: "Test Recursed Result C",
        StartIndex: 32,
        EndIndex: 48
    }], (expression) => {
        switch (expression) {
            case "Test Result": return ["Test Recursed Result A", "Test Recursed Result B", "Test Recursed Result C"]
            case "Test Argument": return "Test Recursed Argument"
            default: fail("Unexpected expression")
        }
    })

    Test("boolean", {
        Type: "Boolean",
        StartIndex: 32,
        EndIndex: 48,
        Value: "Irrelevant"
    }, [{
        Type: "Boolean",
        StartIndex: 32,
        EndIndex: 48,
        Value: "Irrelevant"
    }])

    Test("integer", {
        Type: "Integer",
        StartIndex: 32,
        EndIndex: 48,
        Value: "Irrelevant"
    }, [{
        Type: "Integer",
        StartIndex: 32,
        EndIndex: 48,
        Value: "Irrelevant"
    }])

    Test("float", {
        Type: "Float",
        StartIndex: 32,
        EndIndex: 48,
        Value: "Irrelevant"
    }, [{
        Type: "Float",
        StartIndex: 32,
        EndIndex: 48,
        Value: "Irrelevant"
    }])

    Test("unknown", {
        Type: "Unknown",
        StartIndex: 32,
        EndIndex: 48,
        Tokens: "Irrelevant"
    }, [{
        Type: "Unknown",
        StartIndex: 32,
        EndIndex: 48,
        Tokens: "Irrelevant"
    }])

    Test("next statement not found", {
        Type: "NextStatementNotFound",
        Tokens: "Irrelevant",
        StartIndex: 32,
        EndIndex: 48
    }, [{
        Type: "NextStatementNotFound",
        Tokens: "Irrelevant",
        StartIndex: 32,
        EndIndex: 48
    }])

    Test("unary", {
        Type: "Unary",
        Operator: "Test Unary Operator",
        Operand: "Test Operand",
        StartIndex: 56,
        EndIndex: 67
    }, [{
        Type: "Unary",
        Operator: "Test Unary Operator",
        Operand: "Test Recursed Operand A",
        StartIndex: 56,
        EndIndex: 67
    }, {
        Type: "Unary",
        Operator: "Test Unary Operator",
        Operand: "Test Recursed Operand B",
        StartIndex: 56,
        EndIndex: 67
    }, {
        Type: "Unary",
        Operator: "Test Unary Operator",
        Operand: "Test Recursed Operand C",
        StartIndex: 56,
        EndIndex: 67
    }], (expression) => {
        expect(expression).toEqual("Test Operand")
        return ["Test Recursed Operand A", "Test Recursed Operand B", "Test Recursed Operand C"]
    })

    Test("binary left singular right singular", {
        Type: "Binary",
        Operator: "Test Binary Operator",
        Left: "Test Left Operand",
        Right: "Test Right Operand",
        StartIndex: 56,
        EndIndex: 67
    }, [{
        Type: "Binary",
        Operator: "Test Binary Operator",
        Left: "Test Recursed Left Operand A",
        Right: "Test Recursed Right Operand A",
        StartIndex: 56,
        EndIndex: 67
    }], (expression) => {
        switch (expression) {
            case "Test Left Operand": return ["Test Recursed Left Operand A"]
            case "Test Right Operand": return ["Test Recursed Right Operand A"]
            default: fail("Unexpected expression")
        }
    })

    Test("binary left multiple right singular", {
        Type: "Binary",
        Operator: "Test Binary Operator",
        Left: "Test Left Operand",
        Right: "Test Right Operand",
        StartIndex: 56,
        EndIndex: 67
    }, [{
        Type: "Binary",
        Operator: "Test Binary Operator",
        Left: "Test Recursed Left Operand A",
        Right: "Test Recursed Right Operand A",
        StartIndex: 56,
        EndIndex: 67
    }, {
        Type: "Binary",
        Operator: "Test Binary Operator",
        Left: "Test Recursed Left Operand B",
        Right: "Test Recursed Right Operand A",
        StartIndex: 56,
        EndIndex: 67
    }, {
        Type: "Binary",
        Operator: "Test Binary Operator",
        Left: "Test Recursed Left Operand C",
        Right: "Test Recursed Right Operand A",
        StartIndex: 56,
        EndIndex: 67
    }], (expression) => {
        switch (expression) {
            case "Test Left Operand": return ["Test Recursed Left Operand A", "Test Recursed Left Operand B", "Test Recursed Left Operand C"]
            case "Test Right Operand": return ["Test Recursed Right Operand A"]
            default: fail("Unexpected expression")
        }
    })

    Test("binary left singular right multiple", {
        Type: "Binary",
        Operator: "Test Binary Operator",
        Left: "Test Left Operand",
        Right: "Test Right Operand",
        StartIndex: 56,
        EndIndex: 67
    }, [{
        Type: "Binary",
        Operator: "Test Binary Operator",
        Left: "Test Recursed Left Operand A",
        Right: "Test Recursed Right Operand A",
        StartIndex: 56,
        EndIndex: 67
    }, {
        Type: "Binary",
        Operator: "Test Binary Operator",
        Left: "Test Recursed Left Operand A",
        Right: "Test Recursed Right Operand B",
        StartIndex: 56,
        EndIndex: 67
    }, {
        Type: "Binary",
        Operator: "Test Binary Operator",
        Left: "Test Recursed Left Operand A",
        Right: "Test Recursed Right Operand C",
        StartIndex: 56,
        EndIndex: 67
    }], (expression) => {
        switch (expression) {
            case "Test Left Operand": return ["Test Recursed Left Operand A"]
            case "Test Right Operand": return ["Test Recursed Right Operand A", "Test Recursed Right Operand B", "Test Recursed Right Operand C"]
            default: fail("Unexpected expression")
        }
    })

    Test("binary left multiple right multiple", {
        Type: "Binary",
        Operator: "Test Binary Operator",
        Left: "Test Left Operand",
        Right: "Test Right Operand",
        StartIndex: 56,
        EndIndex: 67
    }, [{
        Type: "Binary",
        Operator: "Test Binary Operator",
        Left: "Test Recursed Left Operand A",
        Right: "Test Recursed Right Operand A",
        StartIndex: 56,
        EndIndex: 67
    }, {
        Type: "Binary",
        Operator: "Test Binary Operator",
        Left: "Test Recursed Left Operand B",
        Right: "Test Recursed Right Operand B",
        StartIndex: 56,
        EndIndex: 67
    }, {
        Type: "Binary",
        Operator: "Test Binary Operator",
        Left: "Test Recursed Left Operand C",
        Right: "Test Recursed Right Operand C",
        StartIndex: 56,
        EndIndex: 67
    }], (expression) => {
        switch (expression) {
            case "Test Left Operand": return ["Test Recursed Left Operand A", "Test Recursed Left Operand B", "Test Recursed Left Operand C"]
            case "Test Right Operand": return ["Test Recursed Right Operand A", "Test Recursed Right Operand B", "Test Recursed Right Operand C"]
            default: fail("Unexpected expression")
        }
    })

    Test("binary inconsistent plurality", {
        Type: "Binary",
        Operator: "Test Binary Operator",
        Left: "Test Left Operand",
        Right: "Test Right Operand",
        StartIndex: 56,
        EndIndex: 67
    }, [{
        Type: "BinaryInconsistentPlurality",
        Operator: "Test Binary Operator",
        Left: ["Test Recursed Left Operand A", "Test Recursed Left Operand B", "Test Recursed Left Operand C"],
        Right: ["Test Recursed Right Operand A", "Test Recursed Right Operand B", "Test Recursed Right Operand C", "Test Recursed Right Operand D"],
        StartIndex: 56,
        EndIndex: 67
    }], (expression) => {
        switch (expression) {
            case "Test Left Operand": return ["Test Recursed Left Operand A", "Test Recursed Left Operand B", "Test Recursed Left Operand C"]
            case "Test Right Operand": return ["Test Recursed Right Operand A", "Test Recursed Right Operand B", "Test Recursed Right Operand C", "Test Recursed Right Operand D"]
            default: fail("Unexpected expression")
        }
    })

    Test("binary concatenate", {
        Type: "Binary",
        Operator: "Concatenate",
        Left: "Test Left Operand",
        Right: "Test Right Operand",
        StartIndex: 56,
        EndIndex: 67
    }, [{
        Type: "ConcatenateLeft",
        Value: "Test Recursed Left Operand A",
        StartIndex: 56,
        EndIndex: 67
    }, {
        Type: "ConcatenateLeft",
        Value: "Test Recursed Left Operand B",
        StartIndex: 56,
        EndIndex: 67
    }, {
        Type: "ConcatenateLeft",
        Value: "Test Recursed Left Operand C",
        StartIndex: 56,
        EndIndex: 67
    }, {
        Type: "ConcatenateRight",
        Value: "Test Recursed Right Operand A",
        StartIndex: 56,
        EndIndex: 67
    }, {
        Type: "ConcatenateRight",
        Value: "Test Recursed Right Operand B",
        StartIndex: 56,
        EndIndex: 67
    }, {
        Type: "ConcatenateRight",
        Value: "Test Recursed Right Operand C",
        StartIndex: 56,
        EndIndex: 67
    }, {
        Type: "ConcatenateRight",
        Value: "Test Recursed Right Operand D",
        StartIndex: 56,
        EndIndex: 67
    }], (expression) => {
        switch (expression) {
            case "Test Left Operand": return ["Test Recursed Left Operand A", "Test Recursed Left Operand B", "Test Recursed Left Operand C"]
            case "Test Right Operand": return ["Test Recursed Right Operand A", "Test Recursed Right Operand B", "Test Recursed Right Operand C", "Test Recursed Right Operand D"]
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
    }, [{
        Type: "Let",
        StartIndex: 56,
        EndIndex: 63,
        Name: "Test Name",
        NameStartIndex: 32,
        NameEndIndex: 41,
        Value: "Test Recursed Value",
        Then: "Test Recursed Then A"
    }, {
        Type: "Let",
        StartIndex: 56,
        EndIndex: 63,
        Name: "Test Name",
        NameStartIndex: 32,
        NameEndIndex: 41,
        Value: "Test Recursed Value",
        Then: "Test Recursed Then B"
    }, {
        Type: "Let",
        StartIndex: 56,
        EndIndex: 63,
        Name: "Test Name",
        NameStartIndex: 32,
        NameEndIndex: 41,
        Value: "Test Recursed Value",
        Then: "Test Recursed Then C"
    }], (expression) => {
        switch (expression) {
            case "Test Then": return ["Test Recursed Then A", "Test Recursed Then B", "Test Recursed Then C"]
            case "Test Value": return "Test Recursed Value"
            default: fail("Unexpected expression")
        }
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
    }, [{
        Type: "LetNameNotUnique",
        StartIndex: 56,
        EndIndex: 63,
        Name: "Test Name",
        NameStartIndex: 32,
        NameEndIndex: 41,
        Value: "Test Recursed Value",
        Then: "Test Recursed Then A"
    }, {
        Type: "LetNameNotUnique",
        StartIndex: 56,
        EndIndex: 63,
        Name: "Test Name",
        NameStartIndex: 32,
        NameEndIndex: 41,
        Value: "Test Recursed Value",
        Then: "Test Recursed Then B"
    }, {
        Type: "LetNameNotUnique",
        StartIndex: 56,
        EndIndex: 63,
        Name: "Test Name",
        NameStartIndex: 32,
        NameEndIndex: 41,
        Value: "Test Recursed Value",
        Then: "Test Recursed Then C"
    }], (expression) => {
        switch (expression) {
            case "Test Then": return ["Test Recursed Then A", "Test Recursed Then B", "Test Recursed Then C"]
            case "Test Value": return "Test Recursed Value"
            default: fail("Unexpected expression")
        }
    })

    Test("let without identifier", {
        Type: "LetWithoutIdentifier",
        StartIndex: 56,
        EndIndex: 63,
        Then: "Test Then"
    }, [{
        Type: "LetWithoutIdentifier",
        StartIndex: 56,
        EndIndex: 63,
        Then: "Test Recursed Then A"
    }, {
        Type: "LetWithoutIdentifier",
        StartIndex: 56,
        EndIndex: 63,
        Then: "Test Recursed Then B"
    }, {
        Type: "LetWithoutIdentifier",
        StartIndex: 56,
        EndIndex: 63,
        Then: "Test Recursed Then C"
    }], (expression) => {
        expect(expression).toEqual("Test Then")
        return ["Test Recursed Then A", "Test Recursed Then B", "Test Recursed Then C"]
    })

    Test("let incorrect identifier type", {
        Type: "LetIncorrectIdentifierType",
        StartIndex: 56,
        EndIndex: 63,
        ActualType: "Test Actual Type",
        Value: "Test Value",
        Then: "Test Then"
    }, [{
        Type: "LetIncorrectIdentifierType",
        StartIndex: 56,
        EndIndex: 63,
        ActualType: "Test Actual Type",
        Value: "Test Recursed Value",
        Then: "Test Recursed Then A"
    }, {
        Type: "LetIncorrectIdentifierType",
        StartIndex: 56,
        EndIndex: 63,
        ActualType: "Test Actual Type",
        Value: "Test Recursed Value",
        Then: "Test Recursed Then B"
    }, {
        Type: "LetIncorrectIdentifierType",
        StartIndex: 56,
        EndIndex: 63,
        ActualType: "Test Actual Type",
        Value: "Test Recursed Value",
        Then: "Test Recursed Then C"
    }], (expression) => {
        switch (expression) {
            case "Test Then": return ["Test Recursed Then A", "Test Recursed Then B", "Test Recursed Then C"]
            case "Test Value": return "Test Recursed Value"
            default: fail("Unexpected expression")
        }
    })

    Test("return", {
        Type: "Return",
        StartIndex: 56,
        EndIndex: 63,
        Value: "Test Value"
    }, [{
        Type: "Return",
        StartIndex: 56,
        EndIndex: 63,
        Value: "Test Recursed Value A"
    }, {
        Type: "Return",
        StartIndex: 56,
        EndIndex: 63,
        Value: "Test Recursed Value B"
    }, {
        Type: "Return",
        StartIndex: 56,
        EndIndex: 63,
        Value: "Test Recursed Value C"
    }], (expression) => {
        expect(expression).toEqual("Test Value")
        return ["Test Recursed Value A", "Test Recursed Value B", "Test Recursed Value C"]
    })

    Test("lambda", {
        Type: "Lambda",
        StartIndex: 56,
        EndIndex: 63,
        Name: "Test Name",
        NameStartIndex: 32,
        NameEndIndex: 41,
        Body: "Test Body",
    }, [{
        Type: "Lambda",
        StartIndex: 56,
        EndIndex: 63,
        Name: "Test Name",
        NameStartIndex: 32,
        NameEndIndex: 41,
        Body: "Test Body",
    }])

    Test("lambda without identifier", {
        Type: "LambdaWithoutIdentifier",
        StartIndex: 32,
        EndIndex: 48,
        Body: "Test Body"
    }, [{
        Type: "LambdaWithoutIdentifier",
        StartIndex: 32,
        EndIndex: 48,
        Body: "Test Recursed Body A"
    }, {
        Type: "LambdaWithoutIdentifier",
        StartIndex: 32,
        EndIndex: 48,
        Body: "Test Recursed Body B"
    }, {
        Type: "LambdaWithoutIdentifier",
        StartIndex: 32,
        EndIndex: 48,
        Body: "Test Recursed Body C"
    }], (expression) => {
        expect(expression).toEqual("Test Body")
        return ["Test Recursed Body A", "Test Recursed Body B", "Test Recursed Body C"]
    })

    Test("lambda incorrect identifier type", {
        Type: "LambdaIncorrectIdentifierType",
        StartIndex: 56,
        EndIndex: 63,
        NameStartIndex: 22,
        NameEndIndex: 34,
        ActualType: "Test Actual Type",
        Body: "Test Body"
    }, [{
        Type: "LambdaIncorrectIdentifierType",
        StartIndex: 56,
        EndIndex: 63,
        NameStartIndex: 22,
        NameEndIndex: 34,
        ActualType: "Test Actual Type",
        Body: "Test Recursed Body A"
    }, {
        Type: "LambdaIncorrectIdentifierType",
        StartIndex: 56,
        EndIndex: 63,
        NameStartIndex: 22,
        NameEndIndex: 34,
        ActualType: "Test Actual Type",
        Body: "Test Recursed Body B"
    }, {
        Type: "LambdaIncorrectIdentifierType",
        StartIndex: 56,
        EndIndex: 63,
        NameStartIndex: 22,
        NameEndIndex: 34,
        ActualType: "Test Actual Type",
        Body: "Test Recursed Body C"
    }], (expression) => {
        expect(expression).toEqual("Test Body")
        return ["Test Recursed Body A", "Test Recursed Body B", "Test Recursed Body C"]
    })

    Test("lambda name not unique", {
        Type: "LambdaNameNotUnique",
        StartIndex: 56,
        EndIndex: 63,
        Name: "test scope key b",
        NameStartIndex: 32,
        NameEndIndex: 41,
        Body: "Test Body",
        Scope: {
            "test scope key a": "test scope value a",
            "test scope key b": "test scope value b",
            "test scope key c": "test scope value c"
        }
    }, [{
        Type: "LambdaNameNotUnique",
        StartIndex: 56,
        EndIndex: 63,
        Name: "test scope key b",
        NameStartIndex: 32,
        NameEndIndex: 41,
        Body: "Test Body",
        Scope: {
            "test scope key a": "test scope value a",
            "test scope key b": "test scope value b",
            "test scope key c": "test scope value c"
        }
    }])

    Test("reference", {
        Type: "Reference",
        StartIndex: 32,
        EndIndex: 48,
        Name: "Test Name",
        Value: "Test Value"
    }, [{
        Type: "Reference",
        StartIndex: 32,
        EndIndex: 48,
        Name: "Test Name",
        Value: "Test Recursed Value A"
    }, {
        Type: "Reference",
        StartIndex: 32,
        EndIndex: 48,
        Name: "Test Name",
        Value: "Test Recursed Value B"
    }, {
        Type: "Reference",
        StartIndex: 32,
        EndIndex: 48,
        Name: "Test Name",
        Value: "Test Recursed Value C"
    }], (expression) => {
        expect(expression).toEqual("Test Value")
        return ["Test Recursed Value A", "Test Recursed Value B", "Test Recursed Value C"]
    })

    Test("reference undefined", {
        Type: "ReferenceUndefined",
        StartIndex: 32,
        EndIndex: 48,
        Name: "Irrelevant"
    }, [{
        Type: "ReferenceUndefined",
        StartIndex: 32,
        EndIndex: 48,
        Name: "Irrelevant"
    }])

    Test("lambda expected", {
        Type: "CallLambdaExpected",
        Value: "Test Value",
        StartIndex: 32,
        EndIndex: 48
    }, [{
        Type: "CallLambdaExpected",
        Value: "Test Recursed Value",
        StartIndex: 32,
        EndIndex: 48
    }], (expression) => {
        expect(expression).toEqual("Test Value")
        return "Test Recursed Value"
    })

    Test("get item first", {
        Type: "GetItem",
        Item: 0,
        Of: "Test Value",
        StartIndex: 32,
        EndIndex: 48
    }, [{
        Type: "GetItem",
        Item: 0,
        Of: ["Test Recursed Value A", "Test Recursed Value B", "Test Recursed Value C"],
        Value: "Test Recursed Value A",
        StartIndex: 32,
        EndIndex: 48
    }], (expression) => {
        expect(expression).toEqual("Test Value")
        return ["Test Recursed Value A", "Test Recursed Value B", "Test Recursed Value C"]
    })

    Test("get item middle", {
        Type: "GetItem",
        Item: 1,
        Of: "Test Value",
        StartIndex: 32,
        EndIndex: 48
    }, [{
        Type: "GetItem",
        Item: 1,
        Of: ["Test Recursed Value A", "Test Recursed Value B", "Test Recursed Value C"],
        Value: "Test Recursed Value B",
        StartIndex: 32,
        EndIndex: 48
    }], (expression) => {
        expect(expression).toEqual("Test Value")
        return ["Test Recursed Value A", "Test Recursed Value B", "Test Recursed Value C"]
    })

    Test("get item last", {
        Type: "GetItem",
        Item: 2,
        Of: "Test Value",
        StartIndex: 32,
        EndIndex: 48
    }, [{
        Type: "GetItem",
        Item: 2,
        Of: ["Test Recursed Value A", "Test Recursed Value B", "Test Recursed Value C"],
        Value: "Test Recursed Value C",
        StartIndex: 32,
        EndIndex: 48
    }], (expression) => {
        expect(expression).toEqual("Test Value")
        return ["Test Recursed Value A", "Test Recursed Value B", "Test Recursed Value C"]
    })

    Test("get item over bound", {
        Type: "GetItem",
        Item: 3,
        Of: "Test Value",
        StartIndex: 32,
        EndIndex: 48
    }, [{
        Type: "GetItemOutOfRange",
        Item: 3,
        Of: ["Test Recursed Value A", "Test Recursed Value B", "Test Recursed Value C"],
        StartIndex: 32,
        EndIndex: 48
    }], (expression) => {
        expect(expression).toEqual("Test Value")
        return ["Test Recursed Value A", "Test Recursed Value B", "Test Recursed Value C"]
    })

    Test("get item beyond bound", {
        Type: "GetItem",
        Item: 4,
        Of: "Test Value",
        StartIndex: 32,
        EndIndex: 48
    }, [{
        Type: "GetItemOutOfRange",
        Item: 4,
        Of: ["Test Recursed Value A", "Test Recursed Value B", "Test Recursed Value C"],
        StartIndex: 32,
        EndIndex: 48
    }], (expression) => {
        expect(expression).toEqual("Test Value")
        return ["Test Recursed Value A", "Test Recursed Value B", "Test Recursed Value C"]
    })

    Test("parameter singular", {
        Type: "Parameter",
        Name: "Test Name",
        Primitive: "Test Primitive",
        Plurality: 1,
        StartIndex: 32,
        EndIndex: 48
    }, [{
        Type: "Parameter",
        Name: "Test Name",
        Primitive: "Test Primitive",
        Item: 0,
        Plurality: 1,
        StartIndex: 32,
        EndIndex: 48
    }])

    Test("parameter plural", {
        Type: "Parameter",
        Name: "Test Name",
        Primitive: "Test Primitive",
        Plurality: 4,
        StartIndex: 32,
        EndIndex: 48
    }, [{
        Type: "Parameter",
        Name: "Test Name",
        Primitive: "Test Primitive",
        Item: 0,
        Plurality: 4,
        StartIndex: 32,
        EndIndex: 48
    }, {
        Type: "Parameter",
        Name: "Test Name",
        Primitive: "Test Primitive",
        Item: 1,
        Plurality: 4,
        StartIndex: 32,
        EndIndex: 48
    }, {
        Type: "Parameter",
        Name: "Test Name",
        Primitive: "Test Primitive",
        Item: 2,
        Plurality: 4,
        StartIndex: 32,
        EndIndex: 48
    }, {
        Type: "Parameter",
        Name: "Test Name",
        Primitive: "Test Primitive",
        Item: 3,
        Plurality: 4,
        StartIndex: 32,
        EndIndex: 48
    }])
})