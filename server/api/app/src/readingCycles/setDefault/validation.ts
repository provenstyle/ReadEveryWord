import { Ajv } from 'ajv'
import addFormats from 'ajv-formats'
import { Result, ok, err, ValidationFailed, InvalidSchema } from '@read-every-word/infrastructure'
import { SetDefaultReadingCycle } from '../domain'

const ajv = new Ajv()
addFormats(ajv)

export const validate = async (request: SetDefaultReadingCycle)
  : Promise<Result<unknown, ValidationFailed>> => {

  const schema = {
    type: 'object',
    properties: {
      authId: {type: 'string'},
      id: {type: 'string', format: 'uuid'},
    },
    required: [
      'authId',
      'id'
    ],
    additionalProperties: false,
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