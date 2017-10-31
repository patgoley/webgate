#!/usr/bin/env node

const fs = require('fs')

const action = process.argv[2]
const host = process.argv[3]

if (!action || !host) {
    printHelpAndQuit()    
}

if (host == "localhost") {
    console.error("Do not modify localhost in hosts file")
    process.exit(1)
}

const hostsPath = "/etc/hosts"

const blockLine = `127.0.0.1 ${host}\n`

const hostsFile = fs.readFileSync(hostsPath)

let content = hostsFile ? hostsFile.toString() : ""

switch (action) {
    case 'block':
        block()
        break;
    case 'unblock':
        unblock()
        break;
    default:
        printHelpAndQuit()
}

function block() {
    if (containsBlockLine(content, blockLine)) {
        console.log(`${host} already blocked`)
    } else {
        const newContent = `${content}\n${blockLine}`
        writeHostsFile(newContent)
        console.log(`Blocked ${host}`)
    }
}

function unblock() {
    if (containsBlockLine(content, blockLine)) {
        const newContent = content.replace(blockLine, "")
        writeHostsFile(newContent)
        console.log(`Unblocked ${host}`)
    } else {
        console.log(`${host} is not blocked`)
    }
}

function containsBlockLine(contents, blockLine) {
    return contents.indexOf(blockLine) != -1
}

function writeHostsFile(contents) {
    try {
        fs.writeFileSync(hostsPath, contents)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

function printHelpAndQuit() {
    console.error("Must supply an action { block | unblock } and a hostname as arguments.\nFor example:\ngate block facebook.com")
    process.exit(1)
}