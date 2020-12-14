import React, { useState } from 'react';
import { KeycloakInstance, KeycloakProfile } from 'keycloak-js';
import { VolunteerFieldsFragment } from '../dataFacade';
import { datastore, VolunteerActionModel } from '../datastore/config';

type VolunteerType = VolunteerFieldsFragment | undefined;

export interface IAuthContext {
    keycloak?: KeycloakInstance | undefined
    profile?: KeycloakProfile | undefined
    volunteer?: VolunteerType,
    setVolunteer: (volunteer: VolunteerType) => void
}

export const AuthContext = React.createContext<IAuthContext>({
    setVolunteer: () => {}
});

export const AuthContextProvider = (props: any) => {
    const setVolunteer = (volunteer: VolunteerType) => {
      setState({...state, volunteer: volunteer})
      if (volunteer?._id) {
        const filter = {
          volunteerId: { eq: volunteer._id }
        };
        datastore.restartReplicator(VolunteerActionModel, { filter });
      }
    }
  
    const authContextInitialState: IAuthContext = {
        setVolunteer: setVolunteer,
        volunteer: undefined,
        ...props.value
    } 
  
    const [state, setState] = useState(authContextInitialState)
  
    return (
      <AuthContext.Provider value={state}>
        {props.children}
      </AuthContext.Provider>
    )
  }