<template>
    <b-list-group-item class="px-0">
        <b-container fluid>
            <b-row no-gutters>
                <b-col cols="4" sm="3" lg="2" class="align-self-center">
                    <span class="text-left text-truncate font-weight-bold align-middle">
                        <slot name="label" />
                    </span>
                </b-col>
                <b-col cols="8" sm="9" lg="10" class="pl-2 pl-sm-0">
                    <div class="d-flex align-items-center text-break">
                        <slot name="item-content" />
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </b-list-group-item>
</template>
