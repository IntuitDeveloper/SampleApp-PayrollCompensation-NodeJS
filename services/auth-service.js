let oauthClient = null;

export const setClient = (incomingOauthClient) => {
    oauthClient = incomingOauthClient;
};

export const getClient = () => oauthClient;