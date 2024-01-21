import fs from 'fs';
import _ from 'lodash';
import yaml from 'yaml';
import { URL } from '../constants.js';

/**
 * Class FileSystem
 * @class FileSystem
 * Retrieve items as file system objects
 */
class Items {

    constructor({ path, url}) {
        this.path = path;
        this.itemsPath = path+'/items';
    }

    async convertIndexFileToJSON(path) {
        return yaml.parse(fs.readFileSync(path+'/index.yaml', 'utf8'));
    }

    async expandItem(item, id) {

        if(_.isString(item) && item.startsWith('local://')) {
            const _id = item.replace('local://', '');
            item = await this.fetchItemById(_id);
            item = this.expandItem(item, _id);
        }

        if(_.isString(item) && item.startsWith('./')) {
            item = item.replace('./', URL+'/items/'+id+'/');
        }

        if(_.isArray(item)) {
            item = item.map((sub_item) => {
                return this.expandItem(sub_item, id);
            });
        }

        // Check if object
        if(_.isObject(item)) {
            for (const key in item) {
                item[key] = await this.expandItem(item[key], id);
            }
        }

        return item;

    }

    async fetchItemById(id) {
        const item = await this.convertIndexFileToJSON(this.itemsPath+'/'+id);
        return this.expandItem(item, id);
    }


}


export default Items;