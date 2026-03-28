import {FastifyRequest, FastifyReply} from 'fastify';

export const logRequest = async (request: FastifyRequest, reply: FastifyReply) => {
    request.log.info(
        {
            method: request.method,
            url: request.url,
            body: request.body,
            params: request.params,
            query: request.query
        },
        '[REQUEST]'
    );
};
