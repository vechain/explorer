<template>
    <div>
        <div class="my-3">
            <h3 class="d-inline-block">Page not found</h3>
        </div>
        <div class="text-break">
            <p class="my-4">Sorry we cannot locate the page you requested, please go back to the explorer homepage by clicking the button below.</p>
            <b-button squared variant="outline-primary" :to="{name: 'index'}">BACK TO HOMEPAGE</b-button>
        </div>
    </div>
</template>