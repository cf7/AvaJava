![alt tag](https://raw.githubusercontent.com/ronaldooeee/AvaJava/master/AvaJava_Logo.png)

<b>AvaJava is a mash-up of Python, CoffeeScript, Javascript, Swift, and OCaml that compiles into Javascript.</b> 
It combines the most interesting parts of these languages and also provides a new selection of operators (<i>to come</i>).
This language will be designed in a way to facilitate faster typing and more concise representations that do not sacrifice readability.

####<i>Features/Planned Implementation (Subject to Change)</i>
<ul>
<li> Type Inference
<li> Static and Strong Typing
<li> Typed parameters
<li> Function Return Types
<li> List Ranges
<li> List Comprehensions
<li> First-Class/Higher Order Functions
<li> Currying
<li> User-defined types
<li> Default Parameters
<li> Named Parameters (maybe)
<li> Pattern Matching (maybe)
</ul>

##Grammar

###Microsyntax

```
characterLiteral ::=  letter | digit | [\s]
stringLiteral    ::=  ["] (characterLiteral | '\\'[nsrt'"\\] )* ["]

letter    ::=  [a-zA-Z]
digit     ::=  [\d]
keyword   ::=  'var' | 'while' | 'and' | 'or' | 'not' 
           	| 'true' | 'false' | 'return' | 'for' | 'each' 
	   		| 'if' | 'then' | 'else' | 'in' | 'both' | 'ava'
id        ::=  letter (letter | digit | '_')*
		
assignop  ::=  '=' | '+=' | '-=' | '*=' | '/='
relop     ::=  '<' | '>' | '<=' | '==' | '>=' | '!='
appendop  ::=  '@'
consop    ::=  '::'
addop     ::=  '+' | '-'
mulop     ::=  '*' | '/' | '%' 
prefixop  ::=  '-' | 'not'
postfixop ::=  '!' | '++' | '--'
intlit    ::=  [\d]+
floatlit  ::=  /^(\.\d+|\d+(\.\d+)?)([Ee][+-]?\d+)?$/
boollit   ::=  'true' | 'false'
comment   ::=  '//' [^\r\n]* [\r\n] | '***' ( [.] | [\n] )* '***'
```

###Macrosyntax
```
Program 	::= Block
Block 		::= (Stmt ';')+
Stmt 		::= Decl
    			| 'return' Exp
    			| ConditionalExp
    			| Print    
    			| Loop
    			| Exp
    
Print 		::= 'ava' Exp ';'
Exp 		::= Exp1 
    			| '[' StringList ']'
    			| FunctionExp
Loop 		::= ForLoop
				| 'while' '(' Exp ')' '{' Block '}'
ForLoop 	::= 'for' 'each' id 'in' Exp '{' Block '}' | 'for' 
Decl 		::=	'var' id ('=' Exp)? ';'
    			| 'function' id '(' idList? ')' '=' Exp ';'
FunctionExp	::= '(' Args ')' '->' Block ;'
Call 		::=	id ( id+ | '(' ExpList? ')' ) ';'
Assign 		::= id assignop Exp ';'
    			| '[' idList ']' '=' Exp ';'
VarRef 		::= Assign | (Call | id) ('[' Exp ']')?
ConditionalExp ::= 'if' Exp1 'then' Block ('else if' Exp1 'then' Block)* ('else' Block)? ';'


Args 		::= ExpList
Exp1 		::= Exp2 ('or' Exp2)*
Exp2 		::= Exp3 ('and' Exp3)* ('both' Exp)?
Exp3 		::= Exp4 (relop Exp4)?
Exp4 		::= Exp5 (appendop Exp5)*
Exp5 		::= Exp6 (consop Exp6)*
Exp6 		::= Exp7 (addop Exp7)*
Exp7 		::= Exp8 (mulop Exp8)*
Exp8 		::= prefixop? Exp9
Exp9 		::= Exp10 postfixop?
Exp10 		::= Exp11 ('^^' Exp11)*
Exp11 		::= '(' Exp ')' | VarRef Access* | intlit | floatlit | stringLiteral | boolit | List | SetLiteral | ObjectLiteral

Access		::= '[' Exp ']' | '.' Exp11

ExpList 	::= Exp ( ',' Exp )*
idList 		::= id (',' id)*
LiteralList	::= Literal (',' Literal)*
StringList 	::= stringLiteral (',' stringLiteral)*

Literal 	::= NumericLiteral | characterLiteral | stringLiteral | boolit
NumericLiteral	::= intlit | floatlit
ObjExpList 	::= ObjExp (',' ObjExp)*
ObjectLiteral	::= '{' ObjExpList '}'
SetLiteral 	::= '{' ExpList? '}'
List 		::= '[' ExpList? ']'
String 		::= stringLiteral
```

####Example Programs:
```
var addOdds = (x:int, y:int) ->                                  var addOdds = function (x,y) {
    if x%2 and y%2 both not 0 then x+y else Math.PI end;    if (x%2 !== 0 && y%2 !== 0) {
                                                                return x + y;
addOdds 3 3;                                                } else {
                                                                return Math.PI;
                                                            }
                                                        }
                                                        
                                                        addOdds(3,3);



var factorial = (n:int) ->                                  var factorial = function (n) {
    if n <= 1 then 1 else n * factorial(n - 1) end;         if (n <= 1) {
                                                                return 1;
factorial addOdds 3 3;                                      } else {
                                                                return n * factorial(n - 1);
                                                            }
                                                        }
                                                        
                                                        factorial(addOdds(3,3));


var helloWorld = () -> ava "Hello World" end;           var helloWorld = function () {
                                                            console.log("Hello World");
                                                        }                                             
```

######Execute:
```
./avajava.js [-t] [-a] [-i] pathOrFilename.ava
```
######To Compile & Run:
```
guac hellowWorld.ava
eat hellowWorld
```

#####Identifiers and Reserved Words:
```
var - variable declaration
reserved words - 'var' | 'while' | 'and' | 'or' | 'not' 
		| 'true' | 'false' | 'return' | 'for' | 'each' 
		| 'if' | 'then' | 'else' | 'in' | 'both' | 'ava'
```
		
#####Commments:
```
Single Line Comments => // This is commented

Multi-Line Comments => ***Cada ... 
                        ... Cada***
```                        
######Literals:
```
1 - integer
1.00 - float
1.00e24 - exponentiation
1.00E24 - exponentiation
"h" - character
"hi" - string
true - boolean
false - boolean
[1,2,3] - list
{x:1,y:2} - object
```
 
#####To Print:
```
ava("Hello World!");
```

#####Assignment:
```
var x = 1; // plain javascript
x - 1
x,y = "hi";
x - "hi"
y - "hi"
x,y = 5;
x - 5
y - 5
x = y = 5;
x - 5
y - 5
w = {y: 21, x, z: 22};
w - {y: 21, x: 100, z: 22}
```

#####Operators:
```
x++;
x--;
x^^2; //square x
x^^3; //cube x
x += 10; 
x -= 10; 
x *= 10; 
x /= 10; 
x % 2;
'' => "";
'' => '';
"" => "";
"" => '';
x and y => boolean literal
x or y => boolean literal

not 4 // equivalent to !== 4
not true // false
```

#####Pattern Matching/Destructuring (basically CoffeeScript):
```
[x, y] = [1, 2, 3];
x - 1
y - 2
[x, y] = "hi";
x - "h"
y - "i" 
[x, y, z] = " hi";
x - " ";
y - "h";
z - "i";
```

#####Lists (basically CoffeeScript):
```
[1..10] => [1,2,3,4,5,6,7,8,9]
[1...10] => [1,2,3,4,5,6,7,8,9,10]
```

#####List Operations (basically OCaml and some extra):
```
[1,2,3] @ [4,5,6,7] = [1,2,3,4,5,6,7] = [1...7]
[1,2,3]::[4,5,6,7] = [[1,2,3], [4,5,6,7]]
[1,2,3]++ => [2,3,4]
[1,2,3]^^2 => [1,4,9]
```

#####Objects:
```
{ x:2, y:3, z: { inside: 3 } }
```

#####Sets:
``` 
{ 2, 3, 4 } 

```

#####Tuples:

```
(x,y,z)
((1,2), (2,3), (3,4))
```

#####Functions:
```
var addOdds = (x,y) -> if x % 2 and y % 2 both not 0 then x + y; 
addOdds 3 3;
addOdds(3,3);
addOdds(x=3, y=3);
addOdds 3; // x=3 and y=0  default parameters
```

#####Higher Order Functions:
```
var map = (g, list) -> for each item in list: g item
map ((x) -> x + 1) [1...10]
=> [2,3,4,5,6,7,8,9,10,11]
```

#####Conditionals:
```
1 == 1
1 >= 2
1 <= 2
1 != 2 // not equal
true and false => false
true or false => true

true and true both true => true
true and true both false => false
true and false both false => false
false and false both false => true
```

#####Loops:
``` 
while (x and y both less than 10): ava "Hello World"; 
for x times: ava "Hello World";  
```

#####String Operations:
```
"h" + "e" => "he"  
"e" - "e" => ""
"he" - "e" => "h"  
"heh" - "h" => "he" 
"hehe" - "h" => "hee"
x and y both 0 // instaead of (x == 0 && y == 0)
x and y both not 0 // intead of (x != 0 && y != 0)
```

#####String Operations:
```
"t" + "e" => "te" 
"e" - "e" => ""
"te" - "e" => "t"
"heeh" - "h" => "eeh"
"hehe" - "h" => "ehe"
"t" * 3 => "ttt"
```

#####Arrays:
```
x = []
x[0] => 1 
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

#####Modules (just use "export"):
```
export: { } // exports objects
export: { "add": ((x,y) -> x + y) }
```

#####Scoping:
```
avajava will utilize static scoping.
For example . . .

var x = 3;
var printNumber = () -> ava(x);
var printAgain = () -> var x = 10; printNumber;
printAgain();

will print out 3 because printNumber was instantiated with var x = 3
The var x = 10 instantiated within the printAgain will not affect the scope
of the printNumber call within printAgain. (That would by dynamic scoping.)
```


