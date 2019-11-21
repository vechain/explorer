<template>
    <b-list-group-item>
        <b-container fluid>
            <b-row no-gutters>
                <b-col cols="3 align-self-center">
                    <span class="text-left font-weight-bold align-middle">
                        <slot name="label" />
                    </span>
                </b-col>
                <b-col cols="9">
                    <slot name="item-content" />
                </b-col>
            </b-row>
        </b-container>
    </b-list-group-item>
</template>
