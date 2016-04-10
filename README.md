![alt tag](https://raw.githubusercontent.com/ronaldooeee/AvaJava/master/AvaJava_Logo.png)

<b>AvaJava is a mash-up of Python, CoffeeScript, Javascript, and OCaml that compiles into Python.</b> 
It combines the most interesting parts of these languages, and also provides a new selection of operators (<i>to come</i>).<br>
This language will be designed in a way to facilitate faster typing and more concise representations that do not sacrifice readability.<br>

####<i>Features/Planned Implementation (Subject to Change)</i>
<ul>
<li> Type Inference
<li> Static Scoping
<li> Pattern Matching
<li> List Comprehensions
<li> Higher Order Functions
<li> Currying
<li> User-defined types
<li> Default Parameters
<li> Named Parameters
</ul>

##Grammar

###Microsyntax

```
characterLiteral ::=  letter | digit | [\s]
stringLiteral    ::=  ["] (characterLiteral | '\\'[nsrt'"\\] )* ["]

letter    ::=  [a-zA-Z]
digit     ::=  [\d]
keyword   ::=  'var' | 'while' | 'and' | 'or' | 'not' 
           |   'true' | 'false' | 'return' | 'for' | 'each' 
	   |   'if' | 'then' | 'else' | 'in' | 'both' | 'ava'
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
Program -> Block
Block -> (Stmt ';')+
Stmt -> Decl
	| Assign
	| 'while' '(' Exp ')' '{' Block '}'
    | 'return' Exp
    | ConditionalExp
    | Print
    | Exp
    
Print -> 'ava' Exp ';'
Exp -> Exp1 
    | '[' StringList ']'
    | FunctionExp        
    
Decl -> 'var' id ('=' Exp)? ';'
    | 'function' id '(' idList? ')' '=' Exp ';'
Assign -> id '=' Exp ';'
    | '[' idList ']' '=' Exp ';'
VarRef -> id | Call
ConditionalExp -> 'if' Exp1 'then' Block ('else if' Exp1 'then' Block)* ('else' Block)? ';'
FunctionExp -> '(' Args ')' '->' Block ';'

Args -> ExpList
Exp1 -> Exp2 ('or' Exp2)*
Exp2 -> Exp3 ('and' Exp3)* ('both' Exp)?
Exp3 -> Exp4 (relop Exp4)?
Exp4 -> Exp5 (appendop Exp5)*
Exp5 -> Exp6 (consop Exp6)*
Exp6 -> Exp7 (addop Exp7)*
Exp7 -> Exp8 (mulop Exp8)*
Exp8 -> prefixop? Exp9
Exp9 -> Exp10 postfixop?
Exp10 -> Exp11 ('^^' Exp11)?
Exp11 -> '(' Exp ')' | VarRef | intlit | floatlit | stringLiteral | boolit

Call -> id ( id+ | '(' ExpList? ')' ) ';'

ExpList -> Exp ( ',' Exp )*
idList -> id (',' id)*
LiteralList -> Literal (',' Literal)*
StringList -> stringLiteral (',' stringLiteral)*

Literal -> NumericLiteral | characterLiteral | stringLiteral | boolit
NumericLiteral -> intlit | floatlit
SetLiteral -> '{' LiteralList '}'
List -> '[' ExpList? ']'
String -> stringLiteral
```

####Example Programs:
```
var addOdds = (x,y) ->                                  var addOdds = function (x,y) {
    if x%2 and y%2 both not 0 then x+y else Math.PI;        if (x%2 !== 0 && y%2 !== 0) {
                                                                return x + y;
addOdds 3 3;                                                } else {
                                                                return Math.PI;
                                                            }
                                                        }
                                                        
                                                        addOdds(3,3);



var factorial = (n) ->                                  var factorial = function (n) {
    if n <= 1 then 1 else n * factorial(n - 1);             if (n <= 1) {
                                                                return 1;
factorial addOdds 3 3;                                      } else {
                                                                return n * factorial(n - 1);
                                                            }
                                                        }
                                                        
                                                        factorial(addOdds(3,3));


var helloWorld = () -> ava "Hello World";               var helloWorld = function () {
                                                            console.log("Hello World");
                                                        }                                             
```

######Execute:
```
./avajava.js [-t] [-a] pathOrFilename.ava
```
######To Compile & Run:
```
guac hellowWorld.ava
eat hellowWorld
```
#####Identifiers and Reserved Words:
`var - variable declaration`<br>
`reserved words - 'var' | 'while' | 'and' | 'or' | 'not' 
		| 'true' | 'false' | 'return' | 'for' | 'each' 
		| 'if' | 'then' | 'else' | 'in' | 'both' | 'ava'`<br>
		
#####Commments:
`Single Line Comments => // This is commented`
<br>
`Multi-Line Comments => ***Cada ...`<br> 
                        `... Cada***`<br>                        
######Literals:
`1 - integer`<br>
`1.00 - float`<br>
`1.00e24 - exponentiation`<br>
`1.00E24 - exponentiation`<br>
`"h" - character`<br>
`"hi" - string`<br>
`true - boolean`<br>
`false - boolean`<br>
`[1,2,3] - list`<br>
`{x:1,y:2} - object`<br>
 
#####To Print:
`ava("Hello World!");` <br>

#####Assignment:
`var x = 1; // plain javascript`<br>
`x - 1`<br>
`x,y = "hi";`<br>
`x - "hi"`<br>
`y - "hi"`<br>
`x,y = 5;`<br>
`x - 5`<br>
`y - 5`<br>
`x = y = 5;`<br>
`x - 5`<br>
`y - 5`<br>
`w = {y: 21, x, z: 22};`<br>
`w - {y: 21, x: 100, z: 22}`<br>

#####Operators:
`x++;`<br>
`x--;`<br>
`x^^2; //square x`<br>
`x^^3; //cube x`<br>
`x += 10;` <br>
`x -= 10;` <br>
`x *= 10;` <br>
`x /= 10;` <br>
`x % 2;` <br>
`'' = "";`<br>
`'' => '';` <br>
`"" => "";`<br>
`'' => "";`<br>
`"" => '';`<br>
`x and y => boolean literal`<br>
`x or y => boolean literal`<br>

#####Pattern Matching/Destructuring (basically CoffeeScript):
`[x, y] = [1, 2, 3];`<br>
`x - 1`<br>
`y - 2`<br>
`[x, y] = "hi";`<br>
`x - "h"`<br>
`y - "i"` <br>
`[x, y, z] = " hi";`<br>
`x - " ";`<br>
`y - "h";`<br>
`z - "i";`<br>

#####Lists (basically CoffeeScript):
`[1..10] => [1,2,3,4,5,6,7,8,9]`<br>
`[1...10] => [1,2,3,4,5,6,7,8,9,10]`<br>

#####List Operations (basically OCaml and some extra):
`[1,2,3] @ [4,5,6,7] = [1,2,3,4,5,6,7] = [1...7]`<br>
`[1,2,3]::[4,5,6,7] = [[1,2,3], [4,5,6,7]]`<br>
`[1,2,3]++ => [2,3,4]`<br>
`[1,2,3]^^2 => [1,4,9]`<br>

#####Objects:
`{ x:2, y:3, z: { inside: 3 } }`<br>

#####Sets:
`{ 2, 3, 4}`<br>

#####Tuples:

```
(x,y,z)
((1,2), (2,3), (3,4))
```

#####Functions:
`var addOdds = (x,y) -> if x % 2 and y % 2 both not 0 then x + y;`<br> 
`addOdds 3 3;`<br>
`addOdds(3,3);`<br>
`addOdds(x=3, y=3);`<br>
`addOdds 3; // x=3 and y=0  default parameters`<br>

#####Higher Order Functions:
`var map = (g, list) -> for each item in list: g item`<br>
`map ((x) -> x + 1) [1...10]`<br>
`=> [2,3,4,5,6,7,8,9,10,11]`<br>

#####Conditionals:
`1 == 1`<br>
`1 >= 2`<br>
`1 <= 2`<br>
`1 != 2 // not equal`<br>
`true and false => false`<br>
`true or false => true`<br>
`true and true both true => true`<br>
`true and true both false => false`<br>
`true and false both false => false`<br>
`false and false both false => true`<br>

#####Loops: 
`while (x and y both less than 10): ava "Hello World";` <br>
`for x times: ava "Hello World";` <br> 

#####String Operations:
`"h" + "e" => "he" `<br> 
`"e" - "e" => ""`<br>
`"he" - "e" => "h" `<br> 
`"heh" - "h" => "he" `<br>
`"hehe" - "h" => "hee"`<br>

#####Arrays:
`x = []`<br>
`x[0] => 1 `<br>

#####Errors and Exceptions:
`1 + true`<br>
`=> Error "Invalid Addition of Types" 1 + true` <br>
`-------------------------------------^^^^^^^^`<br>
`var addOdds = (x,y) -> if x % 2 + y % 2 both not 0 then x + y;`<br> 
`=> Error "Expected conditional" ...if x % 2 + y % 2 both...`<br>
`--------------------------------------^^^^^^^^^^^^^`<br>

#####Modules (just use "export"):
`export: { } // exports objects`<br>
`export: { "add": ((x,y) -> x + y) }`<br>

#####Scoping:
`avajava will utilize static scoping.`<br>
`For example . . .`<br>
```
var x = 3;
var printNumber = () -> ava(x);
var printAgain = () -> var x = 10; printNumber;
printAgain();
```
`will print out 3 because printNumber was instantiated with var x = 3`<br>
`The var x = 10 instantiated within the printAgain will not affect the scope`<br>
`of the printNumber call within printAgain. (That would by dynamic scoping.)`<br>


