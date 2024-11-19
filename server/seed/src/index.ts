import { handle, timer } from '@read-every-word/infrastructure'


handle(async () => {
    timer(() => {
        console.log("I'm alive")
    })
})
