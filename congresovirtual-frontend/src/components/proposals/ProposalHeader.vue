<template>
    <div class="col-12 px-0">
        <div class="container px-0">
            <div class="header-img default-proposal-img"></div>
            <div v-if="proposal.state !== 0 && proposal.type === 1" class="top-left ml-10 mt-10" style="max-width: 80%;">
                <button
                        @click.prevent="voteProjectProposal(proposal)"
                        class="btn btn-success text-white font-20"
                >
                    <i class="fas fa-thumbs-up"></i>
                </button>
                <label class="text-white align-text-middle ml-15 my-0">{{ $t('propuesta.componentes.header.apoyar1') }}</label>
            </div>
            <div v-else-if="proposal.state !== 0 && proposal.type === 2" class="top-left ml-10 mt-10" style="max-width: 80%;">
                <button
                        @click.prevent="voteProjectProposal(proposal)"
                        class="btn text-white btn-warning font-20"
                >
                    <i class="fas fa-thumbs-up"></i>
                </button>
                <label class="text-white align-text-middle ml-15 my-0">{{ $t('propuesta.componentes.header.apoyar2') }}</label>
            </div>
            <a
                    class="btn text-white bg-indigo-light-2 top-right mr-10 mt-10 font-20"
                    data-toggle="modal"
                    :data-target="'#myModal' + proposal.id"
            >
                <i class="fas fa-share-square"></i>
            </a>
            <h5 class="col-12 hk-sec-title bottom text-white pb-20">
                <div class="row mx-0">
                    <div class="col-12">
                        <small>
                            {{ $t('propuesta.componentes.header.datos.boletin') }}: {{ proposal.boletin }}
                            <v-popover>
                                <span class="tooltip-target"><i class="fas fa-info-circle"></i></span>
                                <template slot="popover">
                                    <p>{{ $t('propuesta.componentes.header.datos.popover_boletin') }}</p>
                                </template>
                            </v-popover>
                        </small>
                    </div>
                    <p class="col-12 mt-15">
                        {{ proposal.titulo }}
                    </p>
                </div>
                <div class="row mx-0 mt-40">
                    <div class="col-12 mb-10">
                        <small class="pt-15" style="margin: 0; font-size: 16px;">
                            <i class="fas fa-user"></i>
                            {{ $t('propuesta.componentes.header.datos.persona') }}:
                            <router-link v-if="proposal.user && proposal.user.username" class="text-white" :to="{ path: '/user', query: { 'username': proposal.user.username } }">
                                {{ proposal.user.username }} ({{ proposal.user.name }} {{ proposal.user.surname }})
                            </router-link>
                            <router-link v-else-if="proposal.user && !proposal.user.username" class="text-white" :to="{ path: '/user', query: { 'user_id': proposal.user.id } }">
                                {{ proposal.user.name }} {{ proposal.user.surname }}
                            </router-link>
                        </small>
                    </div>
                </div>
                <div class="row mx-0">
                    <div class="col-8 mb-5">
                        <small class="pt-15" style="margin:0px; font-size: 16px;">
                            <i class="fas fa-landmark"></i>
                            {{ $t('propuesta.componentes.header.datos.autoria') }}: {{ proposal.autoria }} 
                        </small>
                    </div>
                    <div class="col-4 mb-5 text-right">
                        <small class="pt-15" style="margin:0px; font-size: 16px;">
                            <i class="fas fa-calendar-check"></i>
                            {{ $t('propuesta.componentes.header.datos.inicio') }}: {{ new Date(toLocalDate(proposal.fecha_ingreso)) | moment($t('componentes.moment.formato_sin_hora')) }}
                        </small>
                    </div>
                </div>
            </h5>
        </div>
        <div class="card" :style="mode==='dark'?'background: rgb(12, 1, 80); border-color: #fff;':''"   >
            <div v-if="proposal.type === 1" class="d-block font-20 text-center text-white" style="padding:0px">
                <div class="bg-indigo-light-1">
                    {{ $t('propuesta.componentes.header.inclusion.titulo') }}
                    <v-popover>
                        <span class="tooltip-target font-18"><i class="fas fa-question-circle"></i></span>
                        <template slot="popover">
                            <p>{{ $t('propuesta.componentes.header.inclusion.popover') }}</p>
                        </template>
                    </v-popover>
                </div>
                <div class="row mx-0 align-items-center justify-content-center">
                    <div class="col-10">
                        <p class="my-10" :class="mode==='dark'?'':'text-primary'">
                            <strong>{{ $t('propuesta.componentes.header.inclusion.strong') }} </strong>{{ proposal.petitions }} {{ $t('propuesta.componentes.header.inclusion.de') }} {{ maxPetitions }}
                        </p>
                        <div class="progress mb-10">
                            <div class="progress-bar progress-bar-striped bg-primary" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" :style="{ width: (proposal.petitions/maxPetitions * 100) + '%' }"></div>
                        </div>
                    </div>
                </div>
                <div v-if="proposal.state === 0" class="bg-red-dark-3">
                    {{ $t('votacion_cerrada') }}
                </div>
            </div>
            <div v-if="proposal.type === 2" class="d-block font-20 text-center text-white" style="padding:0px">
                <div class="bg-yellow-dark-1">
                    {{ $t('propuesta.componentes.header.urgencia.titulo') }}
                    <v-popover>
                        <span class="tooltip-target font-18"><i class="fas fa-question-circle"></i></span>
                        <template slot="popover">
                            <p>{{ $t('propuesta.componentes.header.urgencia.popover') }}</p>
                        </template>
                    </v-popover>
                </div>
                <div class="row mx-0 align-items-center justify-content-center">
                    <div class="col-10">
                        <p class="my-10" :class="mode==='dark'?'':'text-primary'">
                            <strong>{{ $t('propuesta.componentes.header.urgencia.strong') }} </strong>{{ proposal.urgencies }} {{ $t('propuesta.componentes.header.urgencia.de') }} {{ maxPetitions }}
                        </p>
                        <div class="progress mb-10">
                            <div class="progress-bar progress-bar-striped bg-warning" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" :style="{ width: (proposal.urgencies/maxPetitions * 100) + '%' }"></div>
                        </div>
                    </div>
                </div>
                <div v-if="proposal.state === 0" class="bg-red-dark-3">
                    {{ $t('votacion_cerrada') }}
                </div>
            </div>
        </div>
        <div class="modal" :id="'myModal'+ proposal.id">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">{{ $t('compartir') }}</h4>
                        <button type="button" class="close" data-dismiss="modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body text-center">
                        <social-sharing
                                :url="APP_URL + '/proposal/' + proposal.id"
                                :title="'Congreso Virtual: '+ proposal.titulo"
                                :description="proposal.titulo"
                                :quote="proposal.titulo"
                                hashtags="congresovirtual"
                                inline-template
                        >
                            <div>
                                <network class="btn btn-block btn-social btn-email bg-red-light-2 text-white" network="email">
                                    <i class="fas fa-envelope"></i> Email
                                </network>
                                <network class="btn btn-block btn-social btn-fb bg-indigo-dark-1 text-white" network="facebook">
                                    <i class="fab fa-facebook-square"></i> Facebook
                                </network>
                                <network class="btn btn-block btn-social bg-blue-dark-2 text text-white" network="linkedin">
                                    <i class="fab fa-linkedin"></i> LinkedIn
                                </network>
                                <network class="btn btn-block btn-social btn-twitter bg-blue-light-1 text text-white" network="twitter">
                                    <i class="fab fa-twitter"></i> Twitter
                                </network>
                                <network class="btn btn-block btn-social bg-green-light-1 text text-white" network="whatsapp">
                                    <i class="fab fa-whatsapp"></i> WhatsApp
                                </network>
                            </div>
                        </social-sharing>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal">{{ $t('cerrar') }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SocialSharing from 'vue-social-sharing';
    import { APP_URL } from '../../data/globals';
    import axios from "../../backend/axios";

    export default {
        name: 'ProposalHeader',
        props: {
            proposal: Object
        },
        components: {
            SocialSharing
        },
        data() {
            return {
                maxPetitions: 100,
                mode: String,
                APP_URL
            }
        },
        mounted() {
            if((this.$store.getters.modo_oscuro === 'dark') || (window.location.href.includes('dark'))) {
                this.mode = 'dark';
            } else {
                this.mode = 'light';
            }

            axios
                .get('/settings', {
                    params: {
                        key: 'max_necessary_petitions'
                    }
                })
                .then(res => {
                    if(res.data[0] !== undefined) {
                        this.maxPetitions = JSON.parse(res.data[0].value).number_petitions;
                    }
                });
        },
        methods: {
            voteProjectProposal(proposal) {
                if(this.isLoggedIn) {
                    axios
                        .post('/urgencies', {
                            urgency: proposal.type,
                            proposal_id: proposal.id
                        })
                        .then(res => {
                            if(proposal.type == 1) {
                                proposal.petitions++;
                            }
                            else {
                                proposal.urgencies++;
                            }
                            this.$toastr('success', 'Su solicitud fue considerada', 'Apoyo enviado');
                        })
                        .catch(() => {
                            this.$toastr('warning', 'Existe guardado un voto de urgencia tuyo para esta propuesta', 'Ya votaste esta urgencia');
                        });
                } else {
                    this.$toastr('warning', '', 'Debes iniciar sesión para poder apoyar una propuesta');
                }
            },
            toLocalDate(date) {
                return this.$moment.utc(date, 'YYYY-MM-DD').local();
            }
        },
        computed: {
            isLoggedIn() {
                return this.$store.getters.isLoggedIn;
            }
        }
    }
</script>