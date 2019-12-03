<template>
    <b-list-group-item class="pl-0">
        <b-container class="pl-1" fluid>
            <b-row no-gutters>
                <b-col cols="3 align-self-center">
                    <span class="text-left font-weight-bold align-middle">
                        <slot name="label" />
                    </span>
                </b-col>
                <b-col cols="9" class="text-break">
                    <slot name="item-content" />
                </b-col>
            </b-row>
        </b-container>
    </b-list-group-item>
</template>
