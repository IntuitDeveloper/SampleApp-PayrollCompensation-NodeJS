import { Router } from 'express';
import dotenv from 'dotenv';

import {getClient} from '../services/auth-service.js';
import {
    getGraphQLClient,
    getEmployeeCompensation,
    getCustomers,
    getAxiosClient,
    getEmployees,
    getItems,
    createTimeActivity
} from '../services/employee-compensation-service.js';

dotenv.config();

const router = Router();

const sandBoxUrl = 'https://qb-sandbox.api.intuit.com/graphql';
const prodUrl = 'https://qb.api.intuit.com/graphql';

const getUrl = () => 
    process.env.ENVIRONMENT === 'sandbox'
      ? sandBoxUrl
      : prodUrl;

const baseHttpUri = process.env.ENVIRONMENT === 'sandbox'
                    ? "https://sandbox-quickbooks.api.intuit.com" 
                    : "https://quickbooks.api.intuit.com";
      
const getEmployeeCompensationClient = () => {
    const clientInstance = getClient?.() || null;
    const tokenObj = clientInstance?.getToken?.()?.getToken?.();
    if (!tokenObj?.access_token || !tokenObj?.realmId) {
        return null;
    }
    const token = tokenObj.access_token;
    const realmId = tokenObj.realmId;
    const graphqlUrl = getUrl();
    const client = getGraphQLClient(graphqlUrl, token, realmId);
    return client;
};

router.get('/compensation/:id', async function (req, res) {
    try {
        const client = getEmployeeCompensationClient();
        if (!client) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const response = await getEmployeeCompensation(client, req.params);
        if (!response || !response.payrollEmployeeCompensations) {
            return res.status(500).json({ message: 'Invalid response from GraphQL' });
        }
        res.send(response);
    } catch (error) {
        console.error('Error fetching compensation', error?.response?.errors || error?.message || error);
        res.status(500).json({ message: 'Failed to fetch compensation', error: error?.response?.errors || error?.message });
    }
});

router.get('/customers', async function (req, res) {
    try {
        const token = getClient()?.getToken()?.getToken();
        if (!token?.access_token || !token?.realmId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const client = getAxiosClient(baseHttpUri, token.access_token);
        const response = await getCustomers(client, token.realmId);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching customers', error);
        res.status(500).json({ message: 'Failed to fetch customers' });
    }
});

router.get('/', async function (req, res) {
    try {
        const token = getClient()?.getToken()?.getToken();
        if (!token?.access_token || !token?.realmId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const client = getAxiosClient(baseHttpUri, token.access_token);
        const response = await getEmployees(client, token.realmId);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching employees', error);
        res.status(500).json({ message: 'Failed to fetch employees' });
    }
});

router.get('/items', async function (req, res) {
    try {
        const token = getClient()?.getToken()?.getToken();
        if (!token?.access_token || !token?.realmId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const client = getAxiosClient(baseHttpUri, token.access_token);
        const response = await getItems(client, token.realmId);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching items', error);
        res.status(500).json({ message: 'Failed to fetch items' });
    }
});

router.post('/time-activity', async function (req, res) {
    try {
        const token = getClient()?.getToken()?.getToken();
        if (!token?.access_token || !token?.realmId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const client = getAxiosClient(baseHttpUri, token.access_token);
        const response = await createTimeActivity(client, token.realmId, req.body);
        res.send(response.data);
    } catch (error) {
        console.error('Error creating time activity', error);
        res.status(500).json({ message: 'Failed to create time activity' });
    }
});

export default router;
