#<b>Avajava</b>
<b>AvaJava is a compiler written in Javascript that translates Javascript to Python.</b> AvaJava combines the most interesting parts of famous languages such as Python, CoffeeScript, Javascript, OCAML, etc., and also provides a new selection of functions (<i>to come</i>).  

####<i>Features/Planned Implementation (Subject to Change)</i>
<ul>
<li> Type Inference
<li> Static Scoping
<li> Pattern Matching
<li> List Comprehensions
<li> Higher Order Functions
</ul>

Example Code:
<br>`var addOdds = (x,y) -> if x % 2 and y % 2 both not 0 then x + y;`<br> `addOdds 3 3;`</br>
<br>`var factorial = (n) -> if n <= 1 then 1 else n * factorial(n - 1); //plain OCaml`<br> `factorial add 3 3;`</br>
<br>` var helloWorld = () -> ava "Hello World"; `</br>

######To Compile & Run:
`guac hellowWorld.ava`<br>
`eat hellowWorld`<br>

#####Identifiers and Reserved Words:
`var - variable declaration`<br>
`reserved words - while | for | if | then | else | in | both | and | or`<br>

#####Commments:
`Single Line Comments => // This is commented`
<br>
`Multi-Line Comments => ***Cada ...`<br> 
                        `... Cada***`<br>
#######Literals:
`1 - integer`<br>
`1.0 - float`<br>
`1.0e24 - exponentiation`<br>
`"h" - character`<br>
`"hi" - string`<br>

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
`x and y`<br>
`x or y`<br>
`To declare a new variable => x = "Hello World"`<br>

######Pattern Matching/Destructuring (basically CoffeeScript):
`[x, y] = [1, 2, 3];`<br>
`x - 1`<br>
`y - 2`<br>
`[x, y] = "hi";`<br>
`x - "h"`<br>
`y - "i"` <br>

######Lists (basically CoffeeScript):
`[1..10] => [1,2,3,4,5,6,7,8,9]`<br>
`[1...10] => [1,2,3,4,5,6,7,8,9,10]`<br>

######List Operations (basically OCaml):
`[1,2,3] @ [4,5,6,7] = [1,2,3,4,5,6,7] = [1...7]`<br>
`[1,2,3]::[4,5,6,7] = [[1,2,3], [4,5,6,7]]`<br>
`[1,2,3]++ = [2,3,4]`<br>

######Pointers:
`a = true;` <br> 
`b = false;` <br>
`x = 100;`<br>
`w = {y: 21, x, z: 22};`<br>
`w - {y: 21, x: 100, z: 22}`<br>
`[x, y, z] = " hi";`<br>
`x - " ";`<br>
`y - "h";`<br>
`z - "i";`<br>
`Example Pointer (From Justin): x - 1;` <br>

#####Loops: 
`while (x = 6) < 0 : ava "Hello World";` <br>
`for x in range(0, 3): "Hello World";` <br> 

#####String Literal: 
`String => "Hello"` <br>
`String is a set of chars.` <br> 
`Chars => "h", "e", "l" ... `<br> 
`"h" + "e" => "he" `<br> 
`"e" - "e" => ""`<br>
`"h" - "e" => "h" `<br> 
`"heh" - "h" => "he" `<br>

#####Arrays:
`x = [] Empty `<br>
`x + [1,2,3] => x = [1,2,3] `<br>
`x - [1,2,3] => x = [] `<br>
`x[0] => 1 `<br>

#####Number Literal: 
`Number => x - 4.0` <br> 
` x + 6.3 => 10.3` <br> 
` 1.2 + 3 => 4.2` <br> 

#####Execeptions:
`1 + true => Error "Invalid Addition of Types"` <br>
`1 - true => Error "Invalid Addition of Types"` <br> 



