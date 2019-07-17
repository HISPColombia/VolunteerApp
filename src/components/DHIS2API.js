class DHIS2Api {
    constructor(d2) {
        this.d2 = d2;
    }

    async getResourceSelected(resource, param) {
        const api = this.d2.Api.getApi();
        let result = {};
        try {
            let res = await api.get('/' + resource + "?" + param);
            if (res.hasOwnProperty(resource)) {
                return res;
            }
        }
        catch (e) {
            console.error('Could not access to API Resource');
        }
        return result;
    }
    async getOrgUnit(filter) {
        const resource = "organisationUnits"
        const param = "fields=id,parent,code,level,name,openingDate,closedDate,phoneNumber,organisationUnitGroups" + (filter == undefined ? "" : filter)
        return await this.getResourceSelected(resource, param).then(res => {
            return (res[resource])
        })
    }
    async getOrgUnitGroups() {
        const resource = "organisationUnitGroups"
        const param = "fields=id,name"
        return await this.getResourceSelected(resource, param).then(res => {
            return (res[resource])
        })
    }
    async getOrgUnitGroup(filter) {//¿?
        const resource = "organisationUnitGroups"
        const param = "fields=id,name,user,organisationUnits" + (filter == undefined ? "" : filter)
        return await this.getResourceSelected(resource, param).then(res => {
            return (res[resource])
        })
    }

    async setSetting(data) {
        let url = "dataStore/VolunteerApp/setting"
        return await this.setResourceSelected(url, data)
    }
    async upSetting(data) {
        let url = "dataStore/VolunteerApp/setting"
        return await this.upResourceSelected(url, data)
    }

    async getSetting() {
        let url = "dataStore/VolunteerApp/setting"
        return await this.getResourceSelected(url)
    }

    async setResourceSelected(resource,payload) {
        const api = this.d2.Api.getApi();
        let result = {};
        try {
            let res = await api.post('/' + resource,payload);
            return res;            
        }
        catch (e) {
            console.error('Could not access to API Resource');
        }
        return result;
    }

    async upResourceSelected(resource,payload) {
        const api = this.d2.Api.getApi();
        let result = {};
        try {
            let res = await api.update('/' + resource,payload);
            return res;            
        }
        catch (e) {
            console.error('Could not access to API Resource');
        }
        return result;
    }
    

}

export default DHIS2Api;