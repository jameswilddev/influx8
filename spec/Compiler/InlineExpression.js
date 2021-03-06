describe("InlineExpression", () => {
    const Namespace = require("rewire")("../../Exports.js")
    const InlineExpression = Namespace.__get__("InlineExpression")

    function Test(description, input, output, inlineExpression, initialScope, inlineCallExpression) {
        describe(description, () => {
            let result, scope
            beforeEach(() => {
                scope = JSON.parse(JSON.stringify(initialScope || {
                    "test scope key a": "test scope value a",
                    "test scope key b": "test scope value b",
                    "test scope key c": "test scope value c"
                }))
                Namespace.__set__("InlineExpression", inlineExpression || fail)
                Namespace.__set__("InlineCallExpression", inlineCallExpression || fail)
                result = InlineExpression(input, scope)
            })

            it("returns the expected output", () => {
                expect(result).toEqual(output)
            })

            it("does not modify the scope", () => {
                expect(scope).toEqual(initialScope || {
                    "test scope key a": "test scope value a",
                    "test scope key b": "test scope value b",
                    "test scope key c": "test scope value c"
                })
            })
        })
    }

    Test("unknown", {
        Type: "Unknown",
        StartIndex: 32,
        EndIndex: 48,
        Tokens: "Anything"
    }, {
            Type: "Unknown",
            StartIndex: 32,
            EndIndex: 48,
            Tokens: "Anything"
        })

    Test("boolean", {
        Type: "Boolean",
        StartIndex: 32,
        EndIndex: 48,
        Value: "anything"
    }, {
            Type: "Boolean",
            StartIndex: 32,
            EndIndex: 48,
            Value: "anything"
        })

    Test("integer", {
        Type: "Integer",
        StartIndex: 32,
        EndIndex: 48,
        Value: "anything"
    }, {
            Type: "Integer",
            StartIndex: 32,
            EndIndex: 48,
            Value: "anything"
        })

    Test("float", {
        Type: "Float",
        StartIndex: 32,
        EndIndex: 48,
        Value: "anything"
    }, {
            Type: "Float",
            StartIndex: 32,
            EndIndex: 48,
            Value: "anything"
        })

    Test("next statement not found", {
        Type: "NextStatementNotFound",
        Tokens: "Anything",
        StartIndex: 32,
        EndIndex: 48
    }, {
            Type: "NextStatementNotFound",
            Tokens: "Anything",
            StartIndex: 32,
            EndIndex: 48
        })

    Test("unary", {
        Type: "Unary",
        Operator: "Anything",
        Operand: "Test Uninlined Operand",
        StartIndex: 56,
        EndIndex: 64
    }, {
            Type: "Unary",
            Operator: "Anything",
            Operand: "Test Inlined Operand",
            StartIndex: 56,
            EndIndex: 64
        }, (expression, scope) => {
            expect(expression).toEqual("Test Uninlined Operand")
            expect(scope).toEqual({
                "test scope key a": "test scope value a",
                "test scope key b": "test scope value b",
                "test scope key c": "test scope value c"
            })
            return "Test Inlined Operand"
        })

    Test("binary other than call", {
        Type: "Binary",
        Operator: "Anything",
        Left: "Test Uninlined Left",
        Right: "Test Uninlined Right",
        StartIndex: 56,
        EndIndex: 64
    }, {
            Type: "Binary",
            Operator: "Anything",
            Left: "Test Inlined Left",
            Right: "Test Inlined Right",
            StartIndex: 56,
            EndIndex: 64
        }, (expression, scope) => {
            expect(scope).toEqual({
                "test scope key a": "test scope value a",
                "test scope key b": "test scope value b",
                "test scope key c": "test scope value c"
            })
            switch (expression) {
                case "Test Uninlined Left": return "Test Inlined Left"
                case "Test Uninlined Right": return "Test Inlined Right"
                default: fail("Unexpected expression")
            }
        })

    Test("binary call", {
        Type: "Binary",
        Operator: "Call",
        Left: "Test Uninlined Left",
        Right: "Test Uninlined Right",
        StartIndex: 56,
        EndIndex: 64
    }, {
            Type: "Call",
            Lambda: "Test Uninlined Left",
            Argument: "Test Inlined Right",
            Result: "Test Inlined Body",
            StartIndex: 56,
            EndIndex: 64
        }, (expression, scope) => {
            expect(scope).toEqual({
                "test scope key a": "test scope value a",
                "test scope key b": "test scope value b",
                "test scope key c": "test scope value c"
            })
            switch (expression) {
                case "Test Uninlined Left": return "Test Inlined Left"
                case "Test Uninlined Right": return "Test Inlined Right"
                default: fail("Unexpected expression")
            }
        }, undefined, (expression, argument) => {
            expect(expression).toEqual("Test Inlined Left")
            expect(argument).toEqual("Test Inlined Right")
            return "Test Inlined Body"
        })

    Test("let without identifier", {
        Type: "LetWithoutIdentifier",
        StartIndex: 24,
        EndIndex: 37,
        Then: "Test Uninlined Then"
    }, {
            Type: "LetWithoutIdentifier",
            StartIndex: 24,
            EndIndex: 37,
            Then: "Test Inlined Then"
        }, (expression, scope) => {
            expect(expression).toEqual("Test Uninlined Then")
            expect(scope).toEqual({
                "test scope key a": "test scope value a",
                "test scope key b": "test scope value b",
                "test scope key c": "test scope value c"
            })
            return "Test Inlined Then"
        })

    Test("let with incorrect identifier type", {
        Type: "LetIncorrectIdentifierType",
        StartIndex: 24,
        EndIndex: 37,
        ActualType: "Test Actual Type",
        Value: "Test Uninlined Value",
        Then: "Test Uninlined Then"
    }, {
            Type: "LetIncorrectIdentifierType",
            StartIndex: 24,
            EndIndex: 37,
            ActualType: "Test Actual Type",
            Value: "Test Inlined Value",
            Then: "Test Inlined Then"
        }, (expression, scope) => {
            expect(scope).toEqual({
                "test scope key a": "test scope value a",
                "test scope key b": "test scope value b",
                "test scope key c": "test scope value c"
            })
            switch (expression) {
                case "Test Uninlined Value": return "Test Inlined Value"
                case "Test Uninlined Then": return "Test Inlined Then"
                default: fail("Unexpected expression")
            }
        })

    Test("let does not exist in scope", {
        Type: "Let",
        StartIndex: 32,
        EndIndex: 48,
        Name: "test scope key d",
        NameStartIndex: 56,
        NameEndIndex: 61,
        Value: "Test Uninlined Value",
        Then: "Test Uninlined Then"
    }, {
            Type: "Let",
            StartIndex: 32,
            EndIndex: 48,
            Name: "test scope key d",
            NameStartIndex: 56,
            NameEndIndex: 61,
            Value: "Test Inlined Value",
            Then: "Test Inlined Then"
        }, (expression, scope) => {
            switch (expression) {
                case "Test Uninlined Value":
                    expect(scope).toEqual({
                        "test scope key a": "test scope value a",
                        "test scope key b": "test scope value b",
                        "test scope key c": "test scope value c"
                    })
                    return "Test Inlined Value"
                case "Test Uninlined Then":
                    expect(scope).toEqual({
                        "test scope key a": "test scope value a",
                        "test scope key b": "test scope value b",
                        "test scope key c": "test scope value c",
                        "test scope key d": "Test Inlined Value"
                    })
                    return "Test Inlined Then"
                default: fail("Unexpected expression")
            }
        })

    Test("let does not exist in scope could overlap JavaScript object prototype", {
        Type: "Let",
        StartIndex: 32,
        EndIndex: 48,
        Name: "constructor",
        NameStartIndex: 56,
        NameEndIndex: 61,
        Value: "Test Uninlined Value",
        Then: "Test Uninlined Then"
    }, {
            Type: "Let",
            StartIndex: 32,
            EndIndex: 48,
            Name: "constructor",
            NameStartIndex: 56,
            NameEndIndex: 61,
            Value: "Test Inlined Value",
            Then: "Test Inlined Then"
        }, (expression, scope) => {
            switch (expression) {
                case "Test Uninlined Value":
                    expect(scope).toEqual({
                        "test scope key a": "test scope value a",
                        "test scope key b": "test scope value b",
                        "test scope key c": "test scope value c"
                    })
                    return "Test Inlined Value"
                case "Test Uninlined Then":
                    expect(scope).toEqual({
                        "test scope key a": "test scope value a",
                        "test scope key b": "test scope value b",
                        "test scope key c": "test scope value c",
                        "constructor": "Test Inlined Value"
                    })
                    return "Test Inlined Then"
                default: fail("Unexpected expression")
            }
        })

    Test("let already exists in scope", {
        Type: "Let",
        StartIndex: 32,
        EndIndex: 48,
        Name: "test scope key b",
        NameStartIndex: 56,
        NameEndIndex: 61,
        Value: "Test Uninlined Value",
        Then: "Test Uninlined Then"
    }, {
            Type: "LetNameNotUnique",
            StartIndex: 32,
            EndIndex: 48,
            Name: "test scope key b",
            NameStartIndex: 56,
            NameEndIndex: 61,
            Value: "Test Inlined Value",
            Then: "Test Inlined Then"
        }, (expression, scope) => {
            switch (expression) {
                case "Test Uninlined Value":
                    expect(scope).toEqual({
                        "test scope key a": "test scope value a",
                        "test scope key b": "test scope value b",
                        "test scope key c": "test scope value c"
                    })
                    return "Test Inlined Value"
                case "Test Uninlined Then":
                    expect(scope).toEqual({
                        "test scope key a": "test scope value a",
                        "test scope key b": "Test Inlined Value",
                        "test scope key c": "test scope value c"
                    })
                    return "Test Inlined Then"
                default: fail("Unexpected expression")
            }
        })

    Test("let already exists in scope could overlap JavaScript object prototype", {
        Type: "Let",
        StartIndex: 32,
        EndIndex: 48,
        Name: "constructor",
        NameStartIndex: 56,
        NameEndIndex: 61,
        Value: "Test Uninlined Value",
        Then: "Test Uninlined Then"
    }, {
            Type: "LetNameNotUnique",
            StartIndex: 32,
            EndIndex: 48,
            Name: "constructor",
            NameStartIndex: 56,
            NameEndIndex: 61,
            Value: "Test Inlined Value",
            Then: "Test Inlined Then"
        }, (expression, scope) => {
            switch (expression) {
                case "Test Uninlined Value":
                    expect(scope).toEqual({
                        "test scope key a": "test scope value a",
                        "test scope key b": "test scope value b",
                        "test scope key c": "test scope value c",
                        "constructor": "test existing scope value"
                    })
                    return "Test Inlined Value"
                case "Test Uninlined Then":
                    expect(scope).toEqual({
                        "test scope key a": "test scope value a",
                        "test scope key b": "test scope value b",
                        "test scope key c": "test scope value c",
                        "constructor": "Test Inlined Value"
                    })
                    return "Test Inlined Then"
                default: fail("Unexpected expression")
            }
        }, {
            "test scope key a": "test scope value a",
            "test scope key b": "test scope value b",
            "test scope key c": "test scope value c",
            "constructor": "test existing scope value"
        })

    Test("return", {
        Type: "Return",
        StartIndex: 32,
        EndIndex: 48,
        Value: "Test Uninlined Value"
    }, {
            Type: "Return",
            StartIndex: 32,
            EndIndex: 48,
            Value: "Test Inlined Value"
        }, (expression, scope) => {
            expect(expression).toEqual("Test Uninlined Value")
            expect(scope).toEqual({
                "test scope key a": "test scope value a",
                "test scope key b": "test scope value b",
                "test scope key c": "test scope value c"
            })
            return "Test Inlined Value"
        })

    Test("lambda does not exist in scope", {
        Type: "Lambda",
        StartIndex: 56,
        EndIndex: 62,
        Name: "test scope key d",
        NameStartIndex: 32,
        NameEndIndex: 48,
        Body: "Test Uninlined Value"
    }, {
            Type: "Lambda",
            StartIndex: 56,
            EndIndex: 62,
            Name: "test scope key d",
            NameStartIndex: 32,
            NameEndIndex: 48,
            Body: "Test Uninlined Value",
            Scope: {
                "test scope key a": "test scope value a",
                "test scope key b": "test scope value b",
                "test scope key c": "test scope value c"
            }
        })

    Test("lambda does not exist in scope could overlap JavaScript object prototype", {
        Type: "Lambda",
        StartIndex: 56,
        EndIndex: 62,
        Name: "constructor",
        NameStartIndex: 32,
        NameEndIndex: 48,
        Body: "Test Uninlined Value"
    }, {
            Type: "Lambda",
            StartIndex: 56,
            EndIndex: 62,
            Name: "constructor",
            NameStartIndex: 32,
            NameEndIndex: 48,
            Body: "Test Uninlined Value",
            Scope: {
                "test scope key a": "test scope value a",
                "test scope key b": "test scope value b",
                "test scope key c": "test scope value c"
            }
        })

    Test("lambda already exists in scope", {
        Type: "Lambda",
        StartIndex: 56,
        EndIndex: 62,
        Name: "test scope key b",
        NameStartIndex: 32,
        NameEndIndex: 48,
        Body: "Test Uninlined Value"
    }, {
            Type: "LambdaNameNotUnique",
            StartIndex: 56,
            EndIndex: 62,
            Name: "test scope key b",
            NameStartIndex: 32,
            NameEndIndex: 48,
            Body: "Test Uninlined Value",
            Scope: {
                "test scope key a": "test scope value a",
                "test scope key b": "test scope value b",
                "test scope key c": "test scope value c"
            }
        })

    Test("lambda already exists in scope could overlap JavaScript object prototype", {
        Type: "Lambda",
        StartIndex: 56,
        EndIndex: 62,
        Name: "constructor",
        NameStartIndex: 32,
        NameEndIndex: 48,
        Body: "Test Uninlined Value"
    }, {
            Type: "LambdaNameNotUnique",
            StartIndex: 56,
            EndIndex: 62,
            Name: "constructor",
            NameStartIndex: 32,
            NameEndIndex: 48,
            Body: "Test Uninlined Value",
            Scope: {
                "test scope key a": "test scope value a",
                "test scope key b": "test scope value b",
                "test scope key c": "test scope value c",
                "constructor": "test existing scope value"
            }
        }, undefined, {
            "test scope key a": "test scope value a",
            "test scope key b": "test scope value b",
            "test scope key c": "test scope value c",
            "constructor": "test existing scope value"
        })


    Test("lambda without identifier", {
        Type: "LambdaWithoutIdentifier",
        StartIndex: 32,
        EndIndex: 48,
        Body: "Test Uninlined Value"
    }, {
            Type: "LambdaWithoutIdentifier",
            StartIndex: 32,
            EndIndex: 48,
            Body: "Test Inlined Value"
        }, (expression, scope) => {
            expect(expression).toEqual("Test Uninlined Value")
            expect(scope).toEqual({
                "test scope key a": "test scope value a",
                "test scope key b": "test scope value b",
                "test scope key c": "test scope value c"
            })
            return "Test Inlined Value"
        })

    Test("lambda without identifier", {
        Type: "LambdaIncorrectIdentifierType",
        StartIndex: 65,
        EndIndex: 71,
        ActualType: "Test Actual Type",
        NameStartIndex: 32,
        NameEndIndex: 48,
        Body: "Test Uninlined Value"
    }, {
            Type: "LambdaIncorrectIdentifierType",
            StartIndex: 65,
            EndIndex: 71,
            ActualType: "Test Actual Type",
            NameStartIndex: 32,
            NameEndIndex: 48,
            Body: "Test Inlined Value"
        }, (expression, scope) => {
            expect(expression).toEqual("Test Uninlined Value")
            expect(scope).toEqual({
                "test scope key a": "test scope value a",
                "test scope key b": "test scope value b",
                "test scope key c": "test scope value c"
            })
            return "Test Inlined Value"
        })

    Test("valid reference", {
        Type: "Reference",
        StartIndex: 32,
        EndIndex: 48,
        Name: "test scope key b"
    }, {
            Type: "Reference",
            StartIndex: 32,
            EndIndex: 48,
            Name: "test scope key b",
            Value: "test scope value b"
        })

    Test("invalid reference", {
        Type: "Reference",
        StartIndex: 32,
        EndIndex: 48,
        Name: "test scope key d"
    }, {
            Type: "ReferenceUndefined",
            StartIndex: 32,
            EndIndex: 48,
            Name: "test scope key d"
        })

    Test("valid reference could overlap JavaScript object prototype", {
        Type: "Reference",
        StartIndex: 32,
        EndIndex: 48,
        Name: "constructor"
    }, {
            Type: "Reference",
            StartIndex: 32,
            EndIndex: 48,
            Name: "constructor",
            Value: "test existing scope value"
        }, undefined, {
            "test scope key a": "test scope value a",
            "test scope key b": "test scope value b",
            "test scope key c": "test scope value c",
            "constructor": "test existing scope value"
        })

    Test("invalid reference could overlap JavaScript object prototype", {
        Type: "Reference",
        StartIndex: 32,
        EndIndex: 48,
        Name: "constructor"
    }, {
            Type: "ReferenceUndefined",
            StartIndex: 32,
            EndIndex: 48,
            Name: "constructor"
        })

    Test("get item", {
        Type: "GetItem",
        Item: "Test Item",
        Of: "Test Uninlined Value",
        StartIndex: 32,
        EndIndex: 48
    }, {
            Type: "GetItem",
            Item: "Test Item",
            Of: "Test Inlined Value",
            StartIndex: 32,
            EndIndex: 48
        }, (expression, scope) => {
            expect(expression).toEqual("Test Uninlined Value")
            expect(scope).toEqual({
                "test scope key a": "test scope value a",
                "test scope key b": "test scope value b",
                "test scope key c": "test scope value c"
            })
            return "Test Inlined Value"
        })
})