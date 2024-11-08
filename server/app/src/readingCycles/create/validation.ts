import { Ajv } from 'ajv'
import addFormats from 'ajv-formats'
import { Result, ok, err } from '../../infrastructure/Result'
import { ValidationFailed, InvalidSchema } from '../../infrastructure/Validation'
import { CreateReadingCycle } from './handler'

const ajv = new Ajv()
addFormats(ajv)

export const validate = async (request: CreateReadingCycle)
    : Promise<Result<unknown, ValidationFailed<InvalidSchema>>> => {

    const schema = {
        type: 'object',
        properties: {
            authId: {type: 'string'},
            dateStarted: {type: 'string', format: 'date-time'},
            dateCompleted: {type: 'string', format: 'date-time'}
        },
        required: [
            'authId',
            'dateStarted'
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