start = main

main = v:(func / (_ ("#" [^\n]*)? "\r"? "\n" {return null}))* {return v.filter(value => value !== null)}

func = line1_ line2_+ line3_

line1_ = _ val:line1 _ ("#" [^\n]*)? "\r"? "\n" {return val}
line2_ = _ val:line2 _ ("#" [^\n]*)? "\r"? "\n" {return val}
line3_ = _ val:line3 _ ("#" [^\n]*)? {return val}

line1 =  ("!" _ n:name __ i:int ">" o:int {return {type:"def",name:n,input:i,output:o}} ) // 関数宣言
line2 = (p:pos __ n:name i:(__ i:input {return i})+ {return {type:"cal",pos:p,name:n,val:i}}) // 各ブロック
line3 =  ("ret" i:(__ i:input {return i})+ {return {type:"ret",val:i}}) // ret

input = (p:(pos/"i") ":" i:int {return [...p,i]})
        / (p:(pos/"i") {return [...p,0]})
pos = (x:int "," y:int {return [x,y]})

_ = " "* // 空白 自由
__ = " "+ // 空白 必須
name = n:[a-z]* {return n.join("")}
int = d:[0-9]* {return Number(d.join(""))}