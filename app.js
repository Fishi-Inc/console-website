input = document.querySelector('.console-input-text')
output = document.querySelector('.console-output')
input_before = document.querySelector('.console-input-before').innerHTML
discordId = document.querySelector('.discord-id')
document.addEventListener('keydown', keyPressEvents);
input.addEventListener('input', resizeInput);

resizeInput.call(input);

defaultOutput()

var commandHistory = [];
var path = 0;
var executingCommand = false;

function printList(data) {
    for (let x = 0; x < data.length; x++) {
        output.innerHTML += '<pre>' + data[x] + '</pre>'
    }
}

function printCommand() { 
    command = input.value
    output.innerHTML += '<pre class="console-input-before">' + input_before + ' <span>' + command + '</span>' + '</pre>'
    input.value = ''
    input.style.width = '0ch'
}

function defaultOutput() {
    fetch('./assets/text/console.json')
        .then(response => response.json())
        .then(data => {
            printList(data.startup);            
        })
}

function selectCommandLine() {
    input.focus()
}

function keyPressEvents(e) {
    if (e.keyCode == 9) {
        selectCommandLine()
    } else if (e.keyCode == 13) {
        executeCommand()
    } 
    //else if (e.keyCode == 38) {
    //   input.value = commandHistory[commandHistory.length - 1]
    //}
}

function executeCommand() {
    if (executingCommand) { return };
    var command = input.value.split(' ')[0];
    var argument = input.value.split(' ')[1];
    let isCommand = false;
    fetch('./assets/text/console.json')
        .then(response => response.json())
        .then(data => {
            for (let x = 0; x < data.commands.length; x++) {
                if (data.commands[x] == command) { isCommand = true; }
                else { isCommand ? isCommand = true : isCommand = false; }
            }
            if (isCommand) {
                executingCommand = true;
                switch (command) {
                    case 'clear':
                        output.innerHTML = '';
                        executingCommand = false;
                        break;
                    case 'exit':
                        output.innerHTML = '';
                        let x = 0
                        input.value = ''
                        input.style.width = '0ch'
                        setInterval(type, 2000)
                        function type() {
                            if (x < data.secret.length) {
                                output.innerHTML += '<pre>' + data.secret[x] + '</pre>'
                                x++
                                autoScroll()
                            }
                        }
                        executingCommand = false;
                        output.innerHTML += '<pre> </pre>'
                        break;
                    case 'cat':
                        console.log(argument)
                        fetch('./assets/text/console.json')
                            .then(response => response.json())
                            .then(data => {
                                printCommand()
                                if (data.path[argument]) {
                                    if (data.path[argument]["type"] != "file") {
                                        if (data.path[argument]["type"] == "directory") {
                                            output.innerHTML += '<pre>You can\'t view a directory</pre>'
                                        }
                                    } else {
                                        printList(data.path[argument]["content"]);
                                    }
                                } else {
                                    output.innerHTML += '<pre>Can\'t find the file you want to view</pre>'
                                }
                                output.innerHTML += '<pre> </pre>'
                                executingCommand = false;
                            })
                        break;
                    case 'ls':
                        if (!argument) {
                            printCommand()
                            printList(data.output[command])
                            output.innerHTML += '<pre> </pre>'
                            executingCommand = false;
                        } else {
                            console.log(argument)
                            fetch('./assets/text/console.json')
                                .then(response => response.json())
                                .then(data => {
                                    printCommand()
                                    if (data.path[argument]) {
                                        if (data.path[argument]["type"] != "directory") {
                                            if (data.path[argument]["type"] == "file") {
                                                output.innerHTML += '<pre>You can\'t navigate into a file</pre>'
                                            }
                                        } else {
                                            printList(data.path[argument]["content"]);
                                        }
                                    } else {
                                        output.innerHTML += '<pre>Can\'t find the file you want to view</pre>'
                                    }
                                    output.innerHTML += '<pre> </pre>'
                                    executingCommand = false;
                                })
                        }
                        break;
                    default:
                        printCommand()
                        printList(data.output[command])
                        output.innerHTML += '<pre> </pre>'
                        executingCommand = false;
                        break;
                }
            } else {
                printCommand()
                output.innerHTML += '<pre class="console-output-error">command not found</pre>'
                output.innerHTML += '<pre> </pre>'
            }
            autoScroll()
        })
}

function resizeInput() {
    this.style.width = this.value.length + "ch";
}

function autoScroll() {
    window.scrollTo(0,document.body.scrollHeight);
}