export * from './types'
export * from './codec/codec'
export * from './codec/codec-manager'
import { awsSecretManagerLookupStrategy } from './codec/codec-manager'
export * from './operation'

const CredentialLookupStrategies = {
    awsSecretManager: awsSecretManagerLookupStrategy
}
export { CredentialLookupStrategies }