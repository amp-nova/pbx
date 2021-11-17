import _ from 'lodash'
import { CodecConfiguration, ConfigCodec, CMSCodec } from '../../codec'
import { CodecType, codecManager } from '../../codec-manager'
import { AMPRSAConfiguration } from '../../../types'
import { ContentItem } from 'dc-management-sdk-js'
import { AmplienceCodecConfiguration } from './operations'

const fetch = require('cross-fetch')

export class AmplienceCMSCodec extends CMSCodec {
    async getContentItem(args: any): Promise<ContentItem> {
        let path = args.id && `id/${args.id}` || args.key && `key/${args.key}`
        let response = await fetch(`https://${(this.config as AmplienceCodecConfiguration).hubName}.cdn.content.amplience.net/content/${path}?depth=all&format=inlined`)
        return (await response.json()).content
    }
}

export class AmplienceConfigCodec extends AmplienceCMSCodec {
    async getConfig(): Promise<AMPRSAConfiguration> {
        let obj: any = await this.getContentItem({ key: `aria-env-${(this.config as AmplienceCodecConfiguration).environment}` })

        if (!obj) {
            let x = `${(this.config as AmplienceCodecConfiguration).hubName}:${(this.config as AmplienceCodecConfiguration).environment}`
            throw `[ aria ] Couldn't find config with key '${x}'`
        }

        obj.commerce = await this.getContentItem({ id: obj.commerce.id })
        obj.cms.hubs = _.keyBy(obj.cms.hubs, 'key')
        obj.algolia.credentials = _.keyBy(obj.algolia.credentials, 'key')
        obj.algolia.indexes = _.keyBy(obj.algolia.indexes, 'key')

        // console.log(obj)
        return obj as AMPRSAConfiguration
    }
}

const type: CodecType = {
    vendor: 'amplience',
    codecType: 'config',

    validate: (config: any) => {
        return config && config.hubName && config.environment
    },

    create: (config: CodecConfiguration) => {
        return new AmplienceConfigCodec(config)
    }
}
export default type

// register myself with codecManager
codecManager.registerCodecType(type)