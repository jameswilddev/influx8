# SUNRUSE.influx

A simple programming language offering basic functional programming and vector mathematics which compile to JavaScript and GLSL.

*This README describes how to use the NPM package.  A tutorial will be provided when the language is further finalized.*

## Basic usage:

The "Compile" function runs the toolchain, currently returning the generated source code string, or undefined if it could not be compiled.

This will change in the near future to return more information.

```
var influx = require("@sunruse/influx")
console.log(influx.Compile("1 + 3, 4", influx.GLSLCSyntax))
console.log(influx.Compile("1 + 3, 4", influx.JavaScriptCSyntax))
```

```
ivec2((1 + 3), 4)
[(1 + 3), 4]
```

## Toolchain

This is the sequence of function calls made by the "Compile" function shown above.

This will change in the near future.

### ParseUntypedTokens (string -> UntypedToken[])

Splits down the input file by whitespace into token objects, but does not attempt to identify them.

### ParseTokens (UntypedToken -> UnparenthesizedToken[])

Identifies a given token object.  May split said token into further tokens ("324+95" becomes "324", "+", "95", for example).

### ParenthesizeTokens (UnparenthesizedToken[] -> ParenthesizedToken[])

Finds matching pairs of parentheses and converts the flat array of tokens into a tree of parentheses.

### ParseExpression (ParenthesizedToken[], integer, integer -> RawExpression)

Parses given tokens (with a start and end index into the file) into a basic expression AST.

### InlineExpression (RawExpression, Scope -> InlinedExpression)

Inlines all variable declarations, references and function calls.

Scope is an object, where the keys are lowercase variable names, and the values are InlinedExpressions they refer to.

### UnrollExpression (InlinedExpression -> UnrolledExpression[])

Unrolls all vector mathematics into scalar operations.  Each item in the returned array represents a dimension of the resulting vector ("3, 4, 5" would create 3 UnrolledExpressions, for example).

### TypecheckExpression (UnrolledExpression -> TypecheckedExpression)

For unary and binary operators, finds which specific typed version ("integer add" or "float add" as opposed to just "add", for instance) applies in each case.

### VerifyExpression (TypecheckedExpression -> VerifiedExpression or undefined)

Up until this point, any errors encountered were included as part of the expression tree.  This is so they can be shown even if they are not part of the critical path, with reasonable traceability.

This function walks the critical path, creating a simplified AST, or returning undefined should an error exist in the critical path.

### MatchCSyntax (VerifiedExpression[], CSyntax -> CSyntaxMatch or undefined)

Matches up the verified expression to the operations available on the target platform.
This may fail and return undefined if operations are not implemented or impossible on the target platform.

### GenerateCSyntax (CSyntaxMatch, CSyntax -> string)

Generates the final source code from the matched C Syntax.
