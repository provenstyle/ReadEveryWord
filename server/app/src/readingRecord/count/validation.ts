import { Ajv } from 'ajv'
import addFormats from 'ajv-formats'
import { Result, ok, err } from '../../infrastructure/Result'
import { ValidationFailed, InvalidSchema } from '../../infrastructure/Validation'
import { CountReadingRecord } from './handler'

const ajv = new Ajv()
addFormats(ajv)

export const validate = async (request: CountReadingRecord)
    : Promise<Result<unknown, ValidationFailed<InvalidSchema>>> => {

    const schema = {
        type: 'object',
        properties: {
            readingCycleId: {type: 'string', format: 'uuid'}
        },
        required: [
            'readingCycleId'
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
