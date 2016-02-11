#<b>Avajava</b>
<b>AvaJava is a compiler written in Javascript that translates Javascript to Python.</b> AvaJava combines the most interesting parts of famous languages such as Python, CoffeeScript, Javascript, OCAML, etc., and also provides a new selection of functions (<i>to come</i>).  

####<i>Features/Planned Implementation (Subject to Change)</i>
<ul>
<li> Type Inference
<li> Static Scoping
<li> Pattern Matching
<li> List Comprehensions
<li> Higher Order Functions
<li> Currying
<li> User-defined types (and thus Optional Typing)
<li> Default Parameters
<li> Naming Parameters
</ul>

Example Code:
<br>`var addOdds = (x,y) -> if x % 2 and y % 2 both not 0 then x + y;`<br> `addOdds 3 3;`</br>
<br>`var factorial = (n) -> if n <= 1 then 1 else n * factorial(n - 1); // plain OCaml`<br> `factorial addOdds 3 3;`</br>
<br>` var helloWorld = () -> ava "Hello World"; `</br>

######To Compile & Run:
`guac hellowWorld.ava`<br>
`eat hellowWorld`<br>

#####Identifiers and Reserved Words:
`var - variable declaration`<br>
`reserved words - while | for | each | if | then | else | in | both | not | and | or | return`<br>
`less than | greater than`<br>

#####Commments:
`Single Line Comments => // This is commented`
<br>
`Multi-Line Comments => ***Cada ...`<br> 
                        `... Cada***`<br>
#######Literals:
`1 - integer`<br>
`1.00 - float`<br>
`1.00e24 - exponentiation`<br>
`1.00E24 - exponentiation`<br>
`"h" - character`<br>
`"hi" - string`<br>
`true - boolean`<br>
`false - boolean`<br>
 
######To Print:
`ava("Hello World!");` <br>

######Assignment:
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

######Operators:
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

######Pattern Matching/Destructuring (basically CoffeeScript):
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

######Lists (basically CoffeeScript):
`[1..10] => [1,2,3,4,5,6,7,8,9]`<br>
`[1...10] => [1,2,3,4,5,6,7,8,9,10]`<br>

######List Operations (basically OCaml and some extra):
`[1,2,3] @ [4,5,6,7] = [1,2,3,4,5,6,7] = [1...7]`<br>
`[1,2,3]::[4,5,6,7] = [[1,2,3], [4,5,6,7]]`<br>
`[1,2,3]++ => [2,3,4]`<br>
`[1,2,3]^^2 => [1,4,9]`<br>

######Functions:
`var addOdds = (x,y) -> if x % 2 and y % 2 both not 0 then x + y;`<br> 
`addOdds 3 3;`<br>
`addOdds(3,3);`<br>
`addOdds(x=3, y=3);`<br>
`addOdds 3; // x=3 and y=0  default parameters`<br>

######Higher Order Functions:
`var map = (g, list) -> for each item in list: g item`<br>
`map ((x) -> x + 1) [1...10]`<br>
`=> [2,3,4,5,6,7,8,9,10,11]`<br>

######Conditionals:
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

######Loops: 
`while (x and y both less than 10): ava "Hello World";` <br>
`for x times: ava "Hello World";` <br> 

######String Operations:
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
`                                     ^^^^^^^^`<br>
`var addOdds = (x,y) -> if x % 2 + y % 2 both not 0 then x + y;`<br> 
`=> Error "Expected conditional" ...if x % 2 + y % 2 both...`<br>
`                                      ^^^^^^^^^^^^^`<br>


