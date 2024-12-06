import { Ajv } from 'ajv'
import addFormats from 'ajv-formats'
import { Result, ok, err } from '@read-every-word/infrastructure'
import { ValidationFailed, InvalidSchema } from '../../infrastructure/Validation'
import { CreateReadingRecord } from './handler'

const ajv = new Ajv()
addFormats(ajv)

export const validate = async (request: CreateReadingRecord)
    : Promise<Result<unknown, ValidationFailed<InvalidSchema>>> => {

    const schema = {
        type: 'object',
        properties: {
            readingCycleId: { type: 'string', format: 'uuid' },
            dateRead: { type: 'string', format: 'date-time' },
            bookId: { type: 'number', minimum: 0 },
            chapterId: { type: 'number', minimum: 0 }
        },
        required: [
            'readingCycleId',
            'dateRead',
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
