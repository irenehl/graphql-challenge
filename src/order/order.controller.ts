import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { UserDecorator } from '@user/decorators/user.decorator';
import { Role } from '@auth/decorators/role.decorator';
import { RolesGuard } from '@auth/guards/role.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Payload } from '@auth/entities/payload.entity';

@ApiTags('Order')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.orderService.findOne({ id: Number(id) });
    }

    @Get()
    @Role('MANAGER')
    @UseGuards(RolesGuard)
    async findAll(@Query('page') page: string, @Query('limit') limit: string) {
        return this.orderService.findAll({ page, limit });
    }

    @Post()
    async placeOrder(@UserDecorator() user: Payload) {
        return this.orderService.placeOrder(Number(user.sub));
    }
}
