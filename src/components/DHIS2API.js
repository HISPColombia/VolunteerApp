class DHIS2Api{
    constructor(d2){
        this.d2=d2;
    }

    async getResourceSelected(resource,param) {
        const api = this.d2.Api.getApi();
        let result = {};
        try {
            let res = await api.get('/' + resource+"?"+param);
            if (res.hasOwnProperty(resource)) {
                return res;
            }
        }
        catch (e) {
            console.error('Could not access to API Resource');
        }
        return result;
    }
    async getOrgUnit(filter){
        const resource="organisationUnits"
        const param="fields=id,parent,code,level,name,openingDate,closedDate,phoneNumber,organisationUnitGroups"+(filter==undefined?"":filter)
        return await this.getResourceSelected(resource,param).then(res =>{           
            return(res[resource])
        })
    }
    async getOrgUnitGroups(filter){
        const resource="organisationUnitGroupSets"
        const param="fields=organisationUnitGroups[id,name]"+(filter==undefined?"":filter)
        return await this.getResourceSelected(resource,param).then(res =>{           
            return(res[resource])
        })
    }
}

export default DHIS2Api;