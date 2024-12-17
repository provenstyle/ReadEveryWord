import { Result, ok, err, ValidationFailed, InvalidSchema } from '@read-every-word/infrastructure'
import { CreateReadingCycle } from '@read-every-word/domain'
import { Ajv } from 'ajv'
import addFormats from 'ajv-formats'

const ajv = new Ajv()
addFormats(ajv)

export const validate = async (request: CreateReadingCycle)
  : Promise<Result<unknown, ValidationFailed>> => {

  const schema = {
    type: 'object',
    properties: {
      authId: {type: 'string'},
      name: {type: 'string'},
      dateStarted: {type: 'string', format: 'date-time'},
    },
    required: [
      'authId',
      'name',
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
