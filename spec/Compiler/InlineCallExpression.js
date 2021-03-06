describe("InlineCallExpression", () => {
    const Namespace = require("rewire")("../../Exports.js")
    const InlineCallExpression = Namespace.__get__("InlineCallExpression")

    function Test(description, expression, output, inlineExpression, inlineCallExpression) {
        describe(description, () => {
            let expressionCopy, result
            beforeEach(() => {
                Namespace.__set__("InlineExpression", inlineExpression || fail)
                Namespace.__set__("InlineCallExpression", inlineCallExpression || fail)
                expressionCopy = JSON.parse(JSON.stringify(expression))
                // todo swap expression/expressionCopy
                result = InlineCallExpression(expressionCopy, "Test Argument")
            })
            it("returns the expected value", () => expect(result).toEqual(output))
            it("does not modify the expression", () => expect(expressionCopy).toEqual(expression))
        })
    }

    Test("call", {
        Type: "Call",
        Lambda: "Test Lambda",
        Argument: "Test Expression Argument",
        Result: "Test Result",
        StartIndex: 32,
        EndIndex: 48
    }, "Test Recursed Result", undefined, (expression, argument) => {
        expect(expression).toEqual("Test Result")
        expect(argument).toEqual("Test Argument")
        return "Test Recursed Result"
    })

    Test("boolean", {
        Type: "Boolean",
        StartIndex: 32,
        EndIndex: 48,
        Value: "Irrelevant"
    }, {
            Type: "CallLambdaExpected",
            Value: {
                Type: "Boolean",
                StartIndex: 32,
                EndIndex: 48,
                Value: "Irrelevant"
            },
            StartIndex: 32,
            EndIndex: 48
        })

    Test("integer", {
        Type: "Integer",
        StartIndex: 32,
        EndIndex: 48,
        Value: "Irrelevant"
    }, {
            Type: "CallLambdaExpected",
            Value: {
                Type: "Integer",
                StartIndex: 32,
                EndIndex: 48,
                Value: "Irrelevant"
            },
            StartIndex: 32,
            EndIndex: 48
        })

    Test("float", {
        Type: "Float",
        StartIndex: 32,
        EndIndex: 48,
        Value: "Irrelevant"
    }, {
            Type: "CallLambdaExpected",
            Value: {
                Type: "Float",
                StartIndex: 32,
                EndIndex: 48,
                Value: "Irrelevant"
            },
            StartIndex: 32,
            EndIndex: 48
        })

    Test("unknown", {
        Type: "Unknown",
        StartIndex: 32,
        EndIndex: 48,
        Tokens: "Irrelevant"
    }, {
            Type: "CallLambdaExpected",
            Value: {
                Type: "Unknown",
                StartIndex: 32,
                EndIndex: 48,
                Tokens: "Irrelevant"
            },
            StartIndex: 32,
            EndIndex: 48
        })

    Test("next statement not found", {
        Type: "NextStatementNotFound",
        Tokens: "Irrelevant",
        StartIndex: 32,
        EndIndex: 48
    }, {
            Type: "CallLambdaExpected",
            Value: {
                Type: "NextStatementNotFound",
                Tokens: "Irrelevant",
                StartIndex: 32,
                EndIndex: 48
            },
            StartIndex: 32,
            EndIndex: 48
        })

    Test("unary", {
        Type: "Unary",
        Operator: "Any Operator",
        Operand: "Any Operand",
        StartIndex: 56,
        EndIndex: 64
    }, {
            Type: "CallLambdaExpected",
            Value: {
                Type: "Unary",
                Operator: "Any Operator",
                Operand: "Any Operand",
                StartIndex: 56,
                EndIndex: 64
            },
            StartIndex: 56,
            EndIndex: 64
        })

    Test("binary", {
        Type: "Binary",
        Operator: "Any Operator",
        Left: "Any Left Operand",
        Right: "Any Right Operand",
        StartIndex: 56,
        EndIndex: 64
    }, {
            Type: "CallLambdaExpected",
            Value: {
                Type: "Binary",
                Operator: "Any Operator",
                Left: "Any Left Operand",
                Right: "Any Right Operand",
                StartIndex: 56,
                EndIndex: 64
            },
            StartIndex: 56,
            EndIndex: 64
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
    }, "Test Recursed Then", undefined, (expression, argument) => {
        expect(expression).toEqual("Test Then")
        expect(argument).toEqual("Test Argument")
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
    }, "Test Recursed Then", undefined, (expression, argument) => {
        expect(expression).toEqual("Test Then")
        expect(argument).toEqual("Test Argument")
        return "Test Recursed Then"
    })

    Test("let without identifier", {
        Type: "LetWithoutIdentifier",
        StartIndex: 56,
        EndIndex: 63,
        Then: "Test Then"
    }, "Test Recursed Then", undefined, (expression, argument) => {
        expect(expression).toEqual("Test Then")
        expect(argument).toEqual("Test Argument")
        return "Test Recursed Then"
    })

    Test("let incorrect identifier type", {
        Type: "LetIncorrectIdentifierType",
        StartIndex: 56,
        EndIndex: 63,
        ActualType: "Test Actual Type",
        Value: "Test Value",
        Then: "Test Then"
    }, "Test Recursed Then", undefined, (expression, argument) => {
        expect(expression).toEqual("Test Then")
        expect(argument).toEqual("Test Argument")
        return "Test Recursed Then"
    })

    Test("return", {
        Type: "Return",
        StartIndex: 56,
        EndIndex: 63,
        Value: "Test Value"
    }, "Test Recursed Value", undefined, (expression, argument) => {
        expect(expression).toEqual("Test Value")
        expect(argument).toEqual("Test Argument")
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
    }, "Test Inlined Body", (expression, scope) => {
        expect(expression).toEqual("Test Uninlined Body")
        expect(scope).toEqual({
            "test scope key a": "test scope value a",
            "test scope key b": "test scope value b",
            "test scope key c": "test scope value c",
            "Test Name": "Test Argument"
        })
        return "Test Inlined Body"
    })

    Test("lambda without identifier", {
        Type: "LambdaWithoutIdentifier",
        StartIndex: 32,
        EndIndex: 48,
        Body: "Test Body"
    }, "Test Body")

    Test("lambda incorrect identifier type", {
        Type: "LambdaIncorrectIdentifierType",
        StartIndex: 56,
        EndIndex: 63,
        Name: "Test Name",
        NameStartIndex: 32,
        NameEndIndex: 41,
        Body: "Test Body"
    }, "Test Body")

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
    }, "Test Inlined Body", (expression, scope) => {
        expect(expression).toEqual("Test Uninlined Body")
        expect(scope).toEqual({
            "test scope key a": "test scope value a",
            "test scope key b": "Test Argument",
            "test scope key c": "test scope value c"
        })
        return "Test Inlined Body"
    })

    Test("reference", {
        Type: "Reference",
        StartIndex: 32,
        EndIndex: 48,
        Name: "Test Name",
        Value: "Test Uninlined Value"
    }, "Test Inlined Value", undefined, (expression, argument) => {
        expect(expression).toEqual("Test Uninlined Value")
        expect(argument).toEqual("Test Argument")
        return "Test Inlined Value"
    })

    Test("reference undefined", {
        Type: "ReferenceUndefined",
        StartIndex: 32,
        EndIndex: 48,
        Name: "Irrelevant"
    }, {
            Type: "CallLambdaExpected",
            Value: {
                Type: "ReferenceUndefined",
                StartIndex: 32,
                EndIndex: 48,
                Name: "Irrelevant"
            },
            StartIndex: 32,
            EndIndex: 48
        })

    Test("lambda expected", {
        Type: "CallLambdaExpected",
        Value: "Irrelevant",
        StartIndex: 32,
        EndIndex: 48
    }, {
            Type: "CallLambdaExpected",
            Value: "Irrelevant",
            StartIndex: 32,
            EndIndex: 48
        })

    Test("get item", {
        Type: "GetItem",
        Item: "Test Item",
        Of: "Test Uninlined Value",
        StartIndex: 32,
        EndIndex: 48
    }, {
            Type: "CallLambdaExpected",
            Value: {
                Type: "GetItem",
                Item: "Test Item",
                Of: "Test Uninlined Value",
                StartIndex: 32,
                EndIndex: 48
            },
            StartIndex: 32,
            EndIndex: 48
        })

    Test("parameter", {
        Type: "Parameter",
        Name: "Test Name",
        Primitive: "Test Primitive",
        Plurality: 7,
        StartIndex: 32,
        EndIndex: 48
    }, {
            Type: "CallLambdaExpected",
            Value: {
                Type: "Parameter",
                Name: "Test Name",
                Primitive: "Test Primitive",
                Plurality: 7,
                StartIndex: 32,
                EndIndex: 48
            },
            StartIndex: 32,
            EndIndex: 48
        })
})