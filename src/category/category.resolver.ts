import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryInput } from './dtos/input/create-category.input';
import { UpdateCategoryInput } from './dtos/input/update-category.input';
import { PaginationArgs } from '@common/dto/args/pagination.arg';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Public } from '@auth/decorators/public.decorator';
import { Category } from '@prisma/client';
import { RolesGuard } from '@auth/guards/role.guard';
import { Role } from '@auth/decorators/role.decorator';

@Resolver(() => CategoryEntity)
@UseGuards(JwtAuthGuard)
export class CategoryResolver {
    constructor(private readonly categoryService: CategoryService) {}

    @UseGuards(RolesGuard)
    @Role('MANAGER')
    @Mutation(() => CategoryEntity, { name: 'createCategory' })
    async create(
        @Args('createCategoryInput') createCategoryInput: CreateCategoryInput
    ): Promise<Category> {
        return this.categoryService.create(createCategoryInput);
    }

    @UseGuards(RolesGuard)
    @Role('MANAGER')
    @Mutation(() => CategoryEntity, { name: 'updateCategory' })
    async update(
        @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput
    ): Promise<Category> {
        return this.categoryService.update(
            { id: updateCategoryInput.id },
            updateCategoryInput
        );
    }

    @UseGuards(RolesGuard)
    @Role('MANAGER')
    @Mutation(() => CategoryEntity, { name: 'deleteCategory' })
    async delete(
        @Args('id', { type: () => Int }) id: number
    ): Promise<Category> {
        return this.categoryService.delete({ id });
    }

    @Public()
    @Query(() => CategoryEntity, { name: 'findOneCategory' })
    async findOne(
        @Args('id', { type: () => Int }) id: number
    ): Promise<Category> {
        return this.categoryService.findOne({ id });
    }

    @Public()
    @Query(() => [CategoryEntity], { name: 'findAllCategories' })
    async findAll(@Args() paginationArgs: PaginationArgs): Promise<Category[]> {
        return this.categoryService.findAll(paginationArgs);
    }
}
