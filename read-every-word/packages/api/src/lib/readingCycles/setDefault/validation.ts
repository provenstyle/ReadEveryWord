import { Result, ok, err, ValidationFailed, InvalidSchema } from '@read-every-word/foundation'
import { type SetDefaultReadingCycle } from '@read-every-word/domain'
import { Ajv } from 'ajv'
import addFormats from 'ajv-formats'

const ajv = new Ajv()
addFormats(ajv)

export const validate = async (request: SetDefaultReadingCycle)
  : Promise<Result<unknown, ValidationFailed>> => {

  const schema = {
    type: 'object',
    properties: {
      id: {type: 'string', format: 'uuid'},
    },
    required: [
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
