import { NextFunction, Request, Response } from 'express';
import { controller, httpDelete, httpGet, httpPost, httpPut, request, response, next } from 'inversify-express-utils';
import { IPaginator, StatusCode } from '@digichanges/shared-experience';

import ExpressResponder from '../../../App/Presentation/Shared/Http/ExpressResponder';
import RoleTransformer from '../Transformers/RoleTransformer';
import RoleRepRequest from '../Requests/RoleRepRequest';
import IdRequest from '../../../App/Presentation/Requests/IdRequest';
import RoleRequestCriteria from '../Requests/RoleRequestCriteria';
import RoleUpdateRequest from '../Requests/RoleUpdateRequest';
import AuthorizeExpressMiddleware from '../../../Auth/Presentation/Middlewares/AuthorizeExpressMiddleware';
import Permissions from '../../../Config/Permissions';

import IRoleDomain from '../../Domain/Entities/IRoleDomain';
import RoleController from '../Controllers/RoleController';
import ResponseMessageEnum from '../../../App/Domain/Enum/ResponseMessageEnum';
import DefaultMessageTransformer from '../../../App/Presentation/Transformers/DefaultMessageTransformer';

@controller('/api/roles')
class RoleExpressHandler
{
    private responder: ExpressResponder;
    private readonly controller: RoleController;

    constructor()
    {
        this.responder = new ExpressResponder();
        this.controller = new RoleController();
    }

    @httpPost('/', AuthorizeExpressMiddleware(Permissions.ROLES_SAVE))
    public async save(@request() req: Request, @response() res: Response, @next() nex: NextFunction)
    {
        const _request = new RoleRepRequest(req.body);

        const role: IRoleDomain = await this.controller.save(_request);

        void await this.responder.send(role, req, res, StatusCode.HTTP_CREATED, new DefaultMessageTransformer(ResponseMessageEnum.CREATED));
    }

    @httpGet('/', AuthorizeExpressMiddleware(Permissions.ROLES_LIST))
    public async list(@request() req: Request, @response() res: Response)
    {
        const _request = new RoleRequestCriteria(req.query, req.url);

        const paginator: IPaginator = await this.controller.list(_request);

        await this.responder.paginate(paginator, req, res, StatusCode.HTTP_OK, new RoleTransformer());
    }

    @httpGet('/:id', AuthorizeExpressMiddleware(Permissions.ROLES_SHOW))
    public async get_one(@request() req: Request, @response() res: Response, @next() nex: NextFunction)
    {
        const _request = new IdRequest({ id: req.params.id });

        const role: IRoleDomain = await this.controller.getOne(_request);

        void await this.responder.send(role, req, res, StatusCode.HTTP_OK, new RoleTransformer());
    }

    @httpPut('/:id', AuthorizeExpressMiddleware(Permissions.ROLES_UPDATE))
    public async update(@request() req: Request, @response() res: Response, @next() nex: NextFunction)
    {
        const data = {
            id: req.params.id,
            ...req.body
        };

        const _request = new RoleUpdateRequest(data);

        const role: IRoleDomain = await this.controller.update(_request);

        void await this.responder.send(role, req, res, StatusCode.HTTP_CREATED, new DefaultMessageTransformer(ResponseMessageEnum.UPDATED));
    }

    @httpDelete('/:id', AuthorizeExpressMiddleware(Permissions.ROLES_DELETE))
    public async remove(@request() req: Request, @response() res: Response, @next() nex: NextFunction)
    {
        const _request = new IdRequest({ id: req.params.id });

        const data = await this.controller.remove(_request);

        void await this.responder.send(data, req, res, StatusCode.HTTP_CREATED, new RoleTransformer());
    }
}

export default RoleExpressHandler;