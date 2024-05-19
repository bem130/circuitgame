const tokenizer = {
    tokenizer: {
        root: [
            [/#/, { token: 'comment.enclosure', next: '@Lcomment' }],
            {include: "@tlobj"},
            //[/<::/, { token: 'comment.enclosure', next: '@MLTextA' }],
            // [/0[xX][0-9a-fA-F]+/, 'number'],
            // [/\d+/, 'number'],
            // [/(module|import|export|memory|data|table|elem|func|type|call|param|result)/, "keyword"],
        ],
        Lcomment: [
            [/.*/, 'comment', '@pop'],
        ],
        MLstring: [
            [/.*/, 'string', '@pop'],
        ],
        tlobj: [
            [/!/,{token:"dec",next:"@tlobj_1"}],
        ],
        tlobj_1: [ [/ *[a-z]+/,"name","@tlobj_2"], ],
        tlobj_2: [ [/ *[0-9]+/,"ionum","@tlobj_3"]],
        tlobj_3: [ [/>/,"ioarr","@tlobj_4"]],
        tlobj_4: [ [/[0-9]+/,"ionum","@block"]],
        block: [
            [/#/, { token: 'comment.enclosure', next: '@Lcomment' }],
            [/:/, "indexprefix","@index"],
            [/i/, "input"],
            [/[0-9]+/, "number"],
            [/^ *ret/,"ret","@ret"],
            [/[a-z]+/, "name"],
        ],
        index: [ [/[0-9]+/,"index","@pop"]],
        ret: [
            [/#/, { token: 'comment.enclosure', next: '@Lcomment' }],
            [/:/, "indexprefix","@index"],
            [/i/, "input"],
            [/[0-9]+/, "number"],
            [/$/,"tlobj.name","@root"],
        ],
    },
}

const theme = {
    base: "vs-dark",
    inherit: true,
    rules: [
        { token: "comment", fontStyle: "italic"},
        { token: "comment.enclosure", foreground: "#607060"},
        { token: "dec", foreground: "#ff0b5f"},
        { token: "ionum", foreground: "#f772df"},
        { token: "index", foreground: "#ffa2df"},
        { token: "input", foreground: "#ffa20f"},
        { token: "name", foreground: "#77c2ff"},
        { token: "ret", foreground: "#ff5999"},
    ],
    colors: {},
}


export {tokenizer,theme};