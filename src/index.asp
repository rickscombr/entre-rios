<!DOCTYPE html>
<html lang="pt-br">
	<head> 
		<!--==== Head ====-->
		<!--#include file="./include/inc-head.asp"-->
		<!--===/ Head ====-->
		<title>Rios Partners</title>
		<link rel="canonical" href="http://www.riospartners.com.br/"/>
	</head>

	<body id="body">
		<!--==== Acessibilidade - Componente ====-->
		<!--#include file="./include/inc-acessibilidade.asp"-->
		<!--===/ Acessibilidade - Componente ====-->

		<section class="overlay"></section>

		<!--==== Alertas ====-->
		<div id="alerta" class="alerta"></div>
		<!--====/ Alertas ====-->

		<!--==== Menu ====-->
		<header id="header">
			<!--==== Menu - Componente ====-->
			<!--#include file="./include/inc-menu.asp"-->
			<!--===/ Menu - Componente ====-->
		</header>
		<!--===/ Menu ====-->

		<!--==== Conteúdo ====-->
		<main id="main">

			<div class="loading">
				<div class="loader"></div>
			</div>

			<section>
				<h1>Rios Partners</h1>
				<!--==== Carrossel ====-->
				<!--#include file="./include/inc-carousel.asp"-->
				<!--===/ Carrossel ====-->

				<!--==== Quem Somos ====-->
				<!--#include file="./include/inc-quem-somos.asp"-->
				<!--===/ Quem Somos ====-->

				<!--==== Soluções ====-->
				<!--#include file="./include/inc-solucoes.asp"-->
				<!--===/ Soluções ====-->

				<!--==== Equipe ====-->
				<!--#include file="./include/inc-equipe.asp"-->
				<!--===/ Equipe ====-->


				<!--==== Formulários ====-->
				<div id="iForm"></div>
				<!--===/ Formulários ====-->

			</section>
		</main>
		<!--===/ Conteúdo ====-->

		<!--==== Footer ====-->
		<!--#include file="./include/inc-footer.asp"-->
		<!--===/ Footer ====-->

		<!--==== Scripts ====-->
		<!--#include file="./include/inc-script.asp"-->
		<!--===/ Scripts ====-->
		<script>
			$(document).ready(function(){
				abreForm('form-padrao.asp');
				
				$(".fnForm").click(function(e){
					e.preventDefault();
					abreForm('form-padrao.asp');
					scrollRk('#iForm', 0);
				});
			});
		</script>		
	</body>
</html>