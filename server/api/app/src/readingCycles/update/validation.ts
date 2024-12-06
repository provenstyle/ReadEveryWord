import { Ajv } from 'ajv'
import addFormats from 'ajv-formats'
import { Result, ok, err } from '@read-every-word/infrastructure'
import { ValidationFailed, InvalidSchema } from '../../infrastructure/Validation'
import { UpdateReadingCycle } from './handler'

const ajv = new Ajv()
addFormats(ajv)

export const validate = async (request: UpdateReadingCycle)
    : Promise<Result<unknown, ValidationFailed<InvalidSchema>>> => {

    const schema = {
        type: 'object',
        properties: {
            authId: {type: 'string'},
            id: {type: 'string', format: 'uuid'},
            dateCompleted: {type: 'string', format: 'date-time'}
        },
        required: [
            'authId',
            'id',
            'dateCompleted'
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
