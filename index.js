#!/usr/bin/env node

const fs = require('fs')
const hostsPath = "/etc/hosts"

function main() {
    const action = process.argv[2]
    const hosts = getHostArgs()
    if (!action || hosts.length == 0) {
        printHelpAndQuit()    
    }
    const hostsFile = fs.readFileSync(hostsPath)
    let content = hostsFile ? hostsFile.toString() : ""
    let actionFunction;
    switch (action) {
        case 'block':
            actionFunction = block
            break
        case 'unblock':
            actionFunction = unblock
            break;
        default:
            printHelpAndQuit()
    }
    
    const result = hosts.reduce((contents, host) => {
        if (host == "localhost") {
            console.error("Do not modify localhost in hosts file")
            return contents
        }
        return actionFunction(contents, host)
    }, content)
    
    writeHostsFile(result)
}

function block(fileContent, host) {
    const blockLine = blockLineForHost(host)
    if (containsBlockLine(fileContent, blockLine)) {
        console.log(`${host} is already blocked`)
        return fileContent
    } else {
        console.log(`Blocked ${host}`)
        return `${fileContent}${blockLine}`
    }
}

function unblock(fileContent, host) {
    const blockLine = blockLineForHost(host)
    if (containsBlockLine(fileContent, blockLine)) {
        const newContent = fileContent.replace(blockLine, "")
        console.log(`Unblocked ${host}`)
        return newContent
    } else {
        console.log(`${host} is not blocked`)
        return fileContent
    }
}

function blockLineForHost(host) {
    return `127.0.0.1 ${host}\n`
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

function getHostArgs() {
    let i = 3;
    const hosts = []
    for (let i = 3; i < process.argv.length; i++) {
        const host = process.argv[i]
        hosts.push(host)
    }
    return hosts
}

function printHelpAndQuit() {
    console.error("Must supply an action { block | unblock } and a hostname as arguments.\nFor example:\ngate block facebook.com")
    process.exit(1)
}

main()