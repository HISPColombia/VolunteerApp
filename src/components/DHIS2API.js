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
    //get methods
    async getOrgUnit(filter){
        const resource="organisationUnits"
        const param="fields=id,parent,code,level,name,shortName,openingDate,closedDate,phoneNumber,email,organisationUnitGroups"+(filter==undefined?"":filter)
        return await this.getResourceSelected(resource,param).then(res =>{           
            return(res[resource])
        })
    }
    async getOrgUnitGroup(filter) {
        const resource = "organisationUnitGroups"	        // code en la Unidad Organizativa igual que el name del usuario
        const param = "fields=id,name,user,organisationUnits" + (filter == undefined ? "" : filter)	        // name de la Unidad ORganizativa es igual que firtName, Surname del usuario
        return await this.getResourceSelected(resource, param).then(res => {	       
             const resource="users"
            return (res[resource])
        })
    }
    async getOrgUnitGroups(filter){
        const resource="organisationUnitGroupSets"
        const param="fields=organisationUnitGroups[id,name]"+(filter==undefined?"":filter)
        return await this.getResourceSelected(resource,param).then(res =>{           
            return(res[resource])
        })
    }
    async setOrgUnitGroups(oug,ou){
        const resource="organisationUnitGroups/"+oug+"/organisationUnits/"+ou
          return await this.setResourceSelected(resource,{}).then(res =>{           
            return(res[resource])
        })
    }
    async getUsers(filter){
        // code en la Unidad Organizativa igual que el name del usuario
        // name de la Unidad ORganizativa es igual que firtName, Surname del usuario
        const resource="users"
        const param="fields=name,firstName,surname,phoneNumber,userCredentials[username]"+(filter==undefined?"":filter)
        return await this.getResourceSelected(resource,param).then(res =>{           
            return(res[resource])
        })
    }
    async getLangUsers(filter){
        const resource="userSettings/keyUiLocale"
        const param="user="+(filter==undefined?"":filter)
        return await this.getResourceSelected(resource,param).then(res =>{  
           return("en")//return(res)
        })
    }
    async setLangUsers(filter){
        const resource="userSettings/keyUiLocale"+filter
        return await this.setResourceSelected(resource,{}).then(res =>{  
           return("en")//return(res)
        })
    }
    //set methods
    async setOrgUnit(payload){
        const resource="organisationUnits"
        return await this.setResourceSelected(resource,payload).then(res =>{           
            return(res)
        })
    }
    async setUser(payload){
        const resource="users"
        return await this.setResourceSelected(resource,payload).then(res =>{           
            return(res)
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
}

export default DHIS2Api;