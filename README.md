![alt tag](https://raw.githubusercontent.com/ronaldooeee/AvaJava/master/AvaJava_Logo.png)

<b>AvaJava is a mash-up of Python, CoffeeScript, Javascript, Swift, and OCaml that compiles into Javascript.</b> 
It combines the most interesting parts of these languages and also provides a new selection of operators.
This language will be designed to facilitate faster typing and more concise representations that do not sacrifice readability.

####<i>Features</i>
<ul>
<li> Static Scoping
<li> Static and Strong Typing
<li> Type Inference
<li> Typed parameters
<li> Function Return Types
<li> Built-In Functions
<li> First-Class/Higher Order Functions
<li> Lambda Functions
<li> Currying/Uncurrying
<li> List Ranges
<li> List Comprehensions
<li> Cons and Append Operators
<li> String Interpolation
<li> String-Int Operations
<li> Both Expressions
<li> Exponentiation Operator
<li> Scientific Notation
<li> Constant Folding
<li> Unreachable Code Elimination
</ul>

##Grammar

###Microsyntax

```
characterLiteral 	::=  letter | digit | [\s]
stringlit	::=  ["] (characterLiteral | '\\'[nsrt'"\\] )* ["]

letter		::=	 [a-zA-Z]
digit		::=  [\d]
keyword		::=  'var' | 'while' | 'and' | 'or' | 'not' 
           		| 'true' | 'false' | 'return' | 'for' | 'each' | 'do'
	   			| 'if' | 'then' | 'else' | 'in' | 'both' | 'ava' | 'times'
	   			| type
id        	::=  letter (letter | digit | '_')*
key		   	::=	 id | stringlit
assignop  	::=  '=' | '+=' | '-=' | '*=' | '/='
relop     	::=  '<' | '>' | '<=' | '==' | '>=' | '!='
appendop  	::=  '@'
consop    	::=  '::'
addop     	::=  '+' | '-'
mulop     	::=  '*' | '/' | '%' 
prefixop  	::=  '-' | 'not'
postfixop 	::=  '++' | '--'
exponent	::=  '^^'
intlit    	::=  [\d]+
floatlit  	::=  /^(\.\d+|\d+(\.\d+)?)([Ee][+-]?\d+)?$/
boolit   	::=  'true' | 'false'
comment   	::=  '//' [^\r\n]* [\r\n] | '***' ( [.] | [\n] )* '***'
type		::=  'int' | 'string' | 'float' | 'bool' | 'function' | 'list' | 'object' | 'set'
```

###Macrosyntax
```
Program 	::= Block
Block 		::= (Stmt ';')*
Stmt 		::= VarDecl
    			| Print    
    			| Loop
    			| Exp

VarDecl		::= 'var' id ('=' Exp)?

Print 		::= 'ava' Exp

Loop 		::= ForLoop | WhileLoop

ForLoop 	::= 'for' 'each' id 'in' Exp '{' Block '}' 
				| 'for' id 'times' '{' Block '}'
				| 'for' '(' VarDecl ConditionalExp ')' '{' Block '}'
				
WhileLoop	::=	'while' '(' Exp ')' '{' Block '}'

Exp 		::= FunctionExp 
				| 'return' Exp 
				| ConditionalExp 
				| Exp1
    			
FunctionExp	::= 'function' '(' Params ')' '->' Block 'end'
Call 		::=	id ( id* | '(' Args? ')' | Exp* )
Params		::= TypedExpList
Args		::= ExpList
ExpList 	::= Exp ( ',' Exp )*
TypedExpList	::= TypedExp (',' TypedExp)*
TypedExp	::= id ':' type

ConditionalExp ::= 'if' (Exp1 | '(' Exp1 ')') 'then' Block ('else' 'if' (Exp1 | '(' Exp1 ')') 'then' Block)* ('else' Block)? 'end'


Exp1 		::= Exp2 ('or' Exp2)*
Exp2 		::= Exp3 ('and' Exp3)* ('both' Exp)?
Exp3 		::= Exp4 (relop Exp4)?
Exp4 		::= Exp5 (appendop Exp5)*
Exp5 		::= Exp6 (consop Exp6)*
Exp6		::= Exp7 (('…') Exp7)?
Exp7 		::= Exp8 (addop Exp8)*
Exp8 		::= Exp9 (mulop Exp9)*
Exp9 		::= prefixop? Exp10
Exp10 		::= Exp11 postfixop?
Exp11 		::= Exp12 ('^^' Exp12)*
Exp12 		::= '(' Exp ')' | VarRef Access* | intlit | floatlit | stringlit | boolit | List | SetLiteral | ObjectLiteral

VarRef 		::= Assign | (Call | id) ('[' Exp ']')?
Assign 		::= id assignop Exp
Access		::= '[' Exp ']' | '.' Exp12

ObjectLiteral	::= '{' ObjExpList? '}'
ObjExpList 	::= ObjExp (',' ObjExp)*
ObjExp 		::= key ':' Exp
SetLiteral 	::= '{' ExpList? '}'
List 		::= '[' ExpList? ']'
```


####Example Programs:
(with their equivalent Javascript translations)

FunctionCalls can utilize currying to take in arguments.

```
var factorial = function (n:int) ->                     var factorial = function (n) {
    if n <= 1 then 							                  if (n <= 1) {
    	return 1; 					                             return 1;
    else                                                     } else {
    	return n * factorial(n - 1);                            return n * factorial(n - 1);
    end;                                                     }
end;                                                    }
                                                                
factorial addOdds 3 3;                                      
                                                                
// currying is optional                                                                                                                                                           factorial(addOdds(3,3));


var helloWorld = function () -> 			             var helloWorld = function () {
	ava "Hello World";                                       console.log("Hello World");
end;                                                    }   
                                                            
      
var mapFunction = function (f:function, l:list) ->      var mapFunction = function (f, l) {
	var newList = [];							              var newList = [];
	for each x in l {                                        for (x of l) {
		push(newList, f x);                                      newList.push(f(x));
	};                                                       }
	return newList;                                          return newList;
end;                                                    }                                                                                                                                                	                                        
```


######To Compile & Run
```
$ ./avajava.js [-t] [-a] [-i] [-o] pathOrFilename.ava
```

#####To Test
```
$ npm test
```

####Commments
```
// Single Line Comments

***

Multi-Line Comments

***

```

####Print Statements
```
ava("Hello World!");
```

####Higher Order Functions
```
var mapFunction = function (f:function, l:list) -> 
	var newList = [];
	for each x in l {
		push(newList, f x);
	};
	return newList;
end;

var addOne = function (x:int) -> return x + 1; end;

mapFunction(addOne, [1,2,3]);
```

####Lambda (Anonymous) Functions   
```
(function () -> return function () -> return function () -> return 0; end; end; end)();
```
                 
####Primitives
```
1 			// int
1.00 		// float
1.00e24		// float in scientific notation
1.00E24
"h"			// string (even though it is only one character)
"hi"		// string
true 		// boolean
false		// boolean
[1,2,3]		// list
{x:1,y:2}	// object
{1,2,3}		// set
```
 
#####Loops
```
var x = 10;

while (x < 20) {
	ava "Hello World";
}

for x times { ava "Hello World"; };



var x = [ 1, 2, 3, 4, 5 ];

for each number in x { number++; }; 



var m = [ 1, 2, 3, 4, 5 ];

for (var i = 0 if i < length(m) then i++) { 
	ava m[i]; 
} 
// this version requires 'var'
```

#####Assignment:
```
var x = 1;
x = "hi";
x = {y: 21, x: 100, z: 22};
```

#####Operators:
```
x++;		// increment
x--;		// decrement
x^^2; 		// exponentiation, square x
x^^3; 		// cube x
x += 10; 	// x = x + 10;
x -= 10; 
x *= 10; 
x /= 10; 
x % 2;		// modulus
x and y
x or y
```

#####Relational Operators
```
1 == 1
1 >= 2
1 <= 2
1 != 2 			// not equal
true and false 	// yields false
true or false	// yields true
```

#####Both Expressions
Both expressions is a feature that attempts to reduce the redundant code associated with conditional expressions.

```
x and y both 0 		// instaead of (x == 0 && y == 0)
x and y both not 0 	// intead of (x != 0 && y != 0)
```

##### If Statements
```
var x = 10;

if x > 1 then ava "inside if statement" else ava "not inside if statement";

if x < 1 then
	ava "0"
```

#####Lists and List Operations
```
var x = [1,2,3,4,5,6,7];
x[0];
x[1];

[1...10] 	// [1,2,3,4,5,6,7,8,9,10]

[1,2,3]++ 	// [2,3,4]
[1,2,3]^^2 	// [1,4,9]
```

#####List Comprehensions
```
var u = [z^^2 for z in [1,2,3,4,5]];

var w = [(x, y) for x in [1,2,3] for y in [3,1,4] if x != y];

```

#####Cons and Append Operators
```
[1,2,3] @ [4,5,6,7] 	//	[1,2,3,4,5,6,7] = [1...7]

1::2::3::[] 			// [1,2,3]
[1,2,3]::[4,5,6,7]::[] 	// [[1,2,3], [4,5,6,7]]

```

#####Objects
```
var w = { x:2, y:3, z: { inside: 3 } };
w.x;
w.z.inside;
```

#####Sets
``` 
{ 2, 3, 4 } 
```

#####Tuples

```
(x,y,z)
((1,2), (2,3), (3,4))
```

#####String Operations
```
"t" + "e" => "te" 
"e" - "e" => ""
"te" - "e" => "t"
"heeh" - "h" => "eeh"
"hehe" - "h" => "ehe"
"t" * 3 => "ttt"
```

#####Errors and Exceptions:
```
1 + true
=> Error "Invalid Addition of Types" 1 + true 
-------------------------------------^^^^^^^^
var addOdds = (x,y) -> if x % 2 + y % 2 both not 0 then x + y; 
=> Error "Expected conditional" ...if x % 2 + y % 2 both...
--------------------------------------^^^^^^^^^^^^^
```

#####Modules (just use "export")
export() is a builtin function

```
export: { }															module.exports = {};
export: { "add": (function (x:int,y:int) -> return x + y; end;) }	module.exports = { "add": (function (x:int,y:int) -> return x + y; end;) }
```

#####Scoping:
```
***
Avajava utilizes static scoping.
For example . . .
***

var x = 3;
var printNumber = () -> ava(x);
var printAgain = () -> var x = 10; printNumber;
printAgain();

***
. . . will print out 3 because printNumber was instantiated with var x = 3
The var x = 10 instantiated within the printAgain will not affect the scope
of the printNumber call within printAgain. (That would by dynamic scoping.)
***
```

#####Some Edge-Cases of the Language

###### 'var' is optional in for each loops

```
for each var number in x { number++; };
for each number in x { number++; };

```


