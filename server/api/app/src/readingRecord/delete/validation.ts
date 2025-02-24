import { Ajv } from 'ajv'
import addFormats from 'ajv-formats'
import { Result, ok, err, ValidationFailed, InvalidSchema } from '@read-every-word/infrastructure'
import { DeleteReadingRecord } from '@read-every-word/domain'

const ajv = new Ajv()
addFormats(ajv)

export const validate = async (request: DeleteReadingRecord)
    : Promise<Result<unknown, ValidationFailed>> => {

    const schema = {
        type: 'object',
        properties: {
            authId: {type: 'string'},
            readingCycleId: { type: 'string', format: 'uuid' },
            bookId: { type: 'number', minimum: 0 },
            chapterId: { type: 'number', minimum: 0 }
        },
        required: [
            'authId',
            'readingCycleId',
            'bookId',
            'chapterId'
        ],
        additionalProperties: false
    }

    const validator = ajv.compile(schema)

    return (validator(request))
        ? ok(null)
        : err(
            new ValidationFailed(
                validator.errors?.map(e => {
                    return new InvalidSchema({
                        message: e.message,
                        property: e.instancePath || e.params.missingProperty
                    })
                }) ?? []
            )
        )
}
