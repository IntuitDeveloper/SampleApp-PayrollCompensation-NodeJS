import { GraphQLClient, gql } from 'graphql-request';
import axios from 'axios';
import dotenv from 'dotenv'

import { getEmployeeCompensationQuery, getEmployeeCompensationVariables } from '../graphql/employeeCompensation/getEmployeeCompensation.js';

dotenv.config();

export const getGraphQLClient = (endpoint, token, realmId) => new GraphQLClient(endpoint, {
    headers: {
        authorization: `Bearer ${token}`,
        'intuit-realm-id': realmId
    }
});

export const getAxiosClient = (baseUrl, token) => axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
});

const makeHttpRequest = async(client, url, method, body) => {
    try{
        if(method === 'get') {
            const response = await client.get(url);
            return response;
        } else if(method === 'post') {
            const response = await client.post(url, body);
            return response;
        }
    } catch(err) {
        console.log('err', err?.response?.data || err?.message || err);
        throw err;
    }
}

const makeRequest = async (client, queryData, variables) => {
    try{
        const query = gql`${queryData}`;
        const response = await client.request(query, variables);
        return response;
    } catch(error) {
        try {
            const detailed = error?.response || error;
            console.log('An Error Occured', JSON.stringify(detailed, null, 2));
        } catch (e) {
            console.log('An Error Occured', error);
        }
        throw error;
    }
}

export const getEmployees = async (client, realmId) => {
    const query = 'SELECT * FROM Employee maxresults 10';
    const url = `/v3/company/${realmId}/query?query=${encodeURIComponent(query)}`;
    return await makeHttpRequest(client, url, 'get');
}

export const getCustomers = async (client, realmId) => {
    const query = 'SELECT * FROM Customer maxresults 10';
    const url = `/v3/company/${realmId}/query?query=${encodeURIComponent(query)}`;
    const response = await makeHttpRequest(client, url, 'get');

    return response;
}

export const getItems = async (client, realmId) => {
    const query = 'SELECT * FROM Item maxresults 10';
    const url = `/v3/company/${realmId}/query?query=${encodeURIComponent(query)}`;
    const response = await makeHttpRequest(client, url, 'get');

    return response;
}

export const getEmployeeCompensation = async (client, params) => {
    params.employee = params.id;
    params.first = 10;
    params.active = true;
    const response = await makeRequest(client, getEmployeeCompensationQuery, getEmployeeCompensationVariables(params));
    return response;
}

export const createTimeActivity = async (client, realmId, body) => {
    const url = `/v3/company/${realmId}/timeactivity`;
    return await makeHttpRequest(client, url, 'post', body);
}