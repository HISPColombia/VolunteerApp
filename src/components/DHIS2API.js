class DHIS2Api{
    constructor(d2){
        this.d2=d2;
    }

    async getResourceSelected(resource,param) {
        const api = this.d2.Api.getApi();
        let result = {};
        try {
            let res={};
            if(param!=undefined)
                res = await api.get('/' + resource+"?"+param);
            else
                res = await api.get('/' + resource);
            //if (res.hasOwnProperty(resource)) {
            return res;
            //}
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
    async delResourceSelected(resource,payload) {
        const api = this.d2.Api.getApi();
        let result = {};
        try {
            let res = await api.delete('/' + resource,payload);
            return res;            
        }
        catch (e) {
            console.error('Could not access to API Resource');
        }
        return result;
    }
    async putResourceSelected(resource,payload) {
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
    async patchResourceSelected(resource,payload) {
        const api = this.d2.Api.getApi();
        let result = {};
        try {
            let res = await api.patch('/' + resource,payload);
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
        const param="fields=id,parent[id,name,parent[id,code, email]],children[id,code],code,level,name,shortName,coordinates,openingDate,closedDate,phoneNumber,email,organisationUnitGroups[id,code,name]"+(filter==undefined?"":filter)
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
        const param="fields=organisationUnitGroups[id,name,code]"+(filter==undefined?"":filter)
        return await this.getResourceSelected(resource,param).then(res =>{           
            return(res[resource])
        })
    }
    async getProgram(filter){
        const resource="programs/"+filter
        const param="fields=*"
        return await this.getResourceSelected(resource,param).then(res =>{           
            return(res)
        })
    }
    async setProgram(uid,payload){
        const resource="programs/"+uid
          return await this.putResourceSelected(resource,payload).then(res =>{           
            return(res[resource])
        })
    }
    async setOrgUnitGroups(oug,ou){
        const resource="organisationUnitGroups/"+oug+"/organisationUnits/"+ou
          return await this.setResourceSelected(resource,{}).then(res =>{           
            return(res[resource])
        })
    }
    async delOrgUnitGroups(oug,ou){
        const resource="organisationUnitGroups/"+oug+"/organisationUnits/"+ou
          return await this.delResourceSelected(resource,{}).then(res =>{           
            return(res[resource])
        })
    }
    async getUsers(filter){
        // code en la Unidad Organizativa igual que el name del usuario
        // name de la Unidad ORganizativa es igual que firtName, Surname del usuario
        const resource="users"
        const param="fields=id,name,firstName,surname,phoneNumber,dataViewOrganisationUnits,organisationUnits,teiSearchOrganisationUnits,userCredentials[*]"+(filter==undefined?"":filter)
        return await this.getResourceSelected(resource,param).then(res =>{           
            return(res[resource])
        })
    }
    async getLangUsers(filter){
        const resource="userSettings/keyUiLocale"
        const param="user="+(filter==undefined?"":filter)
        return await this.getResourceSelected(resource,param).then(res =>{  
           return(res)
        })
    }
    async getLangDB(filter){
        const resource="userSettings/keyDbLocale"
        const param="user="+(filter==undefined?"":filter)
        return await this.getResourceSelected(resource,param).then(res =>{  
           return(res)
        })
    }
    async setLangUsers(filter){
        const resource="userSettings/keyUiLocale"+filter
        return await this.setResourceSelected(resource,{}).then(res =>{  
           return("en")//return(res)
        })
    }
    async setLangDB(filter){
        const resource="userSettings/keyDbLocale"+filter
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
    //up methods
    async upOrgUnit(payload){
        const resource="organisationUnits/"+payload.id
        return await this.putResourceSelected(resource,payload).then(res =>{           
            return(res)
        })
    }
    async upUser(payload){
        const resource="users/"+payload.id
        return await this.putResourceSelected(resource,payload).then(res =>{           
            return(res)
        })
    }
    async disabledUser(userID,payload){
        const resource="users/"+userID
        return await this.patchResourceSelected(resource,payload).then(res =>{           
            return(res)
        })
    }
    async setSetting(data) {
        let url = "dataStore/VolunteerAppSetting/global"
        return await this.setResourceSelected(url, data)
    }
    async upSetting(data) {
        let url = "dataStore/VolunteerAppSetting/global"
        return await this.putResourceSelected(url, data)
    }

    async getSetting() {
        let url = "dataStore/VolunteerAppSetting/global"
        return await this.getResourceSelected(url)
    }
    async getOUProgram(uid) {
        let url = "programs/"+uid+"?fields=organisationUnits"
        return await this.getResourceSelected(url)
    }
    ///Eternal setting

    async SetResourceExternal(setting,url,method,body){    
        let headers = new Headers(); 
        headers.append('Content-Type', 'application/json');
        headers.set('Authorization', 'Basic ' + Buffer.from(setting.userId + ":" + setting.passwordUser).toString('base64'));
        return fetch(url, 
                {
                method,
                headers,
                body
                }).then(response => response.json())
                .catch(error => console.error('Error:', error));
        }

    async GetResourceExternal(setting,url,method){
        let headers = new Headers(); 
        headers.append('Content-Type', 'application/json');
        headers.set('Authorization', 'Basic ' + Buffer.from(setting.userId + ":" + setting.passwordUser).toString('base64'));
        return fetch(url, 
                {
                method,
                headers
                }).then(response => response.json())
                .catch(error => console.error('Error:', error));
        }
    /// setting OrgUnit
     //set methods
     async setExternalOrgUnit(setting,payload){
        const resource=setting.remoteServer+"/api/"+"organisationUnits"
        return await this.SetResourceExternal(setting,resource,"POST",JSON.stringify(payload)).then(res =>{           
            return(res)
        })
    }

    async setExernalProgram(setting,uid,payload){
        const resource=setting.remoteServer+"/api/"+"programs/"+uid
          return await this.SetResourceExternal(setting,resource,"PUT",JSON.stringify(payload)).then(res =>{           
            return(res)
        })
    }
    async setExernalOrgUnitGroups(setting,oug,ou){
        const resource=setting.remoteServer+"/api/"+"organisationUnitGroups/"+oug+"/organisationUnits/"+ou
          return await this.SetResourceExternal(setting,resource,"POST",{}).then(res =>{           
            return(res)
        })
    }
    async upExternalOrgUnit(setting,payload){
        const resource=setting.remoteServer+"/api/"+"organisationUnits/"+payload.id
        return await this.SetResourceExternal(setting,resource,"PUT",JSON.stringify(payload)).then(res =>{           
            return(res)
        })
    }
}

export default DHIS2Api;