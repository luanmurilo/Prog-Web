//Escutadores
document.querySelector("#formulario").addEventListener("submit", validacoes);        
document.querySelectorAll("input[name='regiao']").forEach(elemento => {elemento.addEventListener("click", radioRegiao)})
document.querySelector("#botaoReinicia").addEventListener("click", reinicia);
document.querySelector("#botaoAjuda").addEventListener("click", abrePopupModal);
document.querySelector("#botaoFechaModal").addEventListener("click", fechaPopupModal);
document.querySelector("#botaoFechaModalErro").addEventListener("click", fechaPopupModalErro);
document.querySelector("#botaoFechaModalEnviado").addEventListener("click", fechaPopupModalEnviado);

//Lista com menssagens de erro que sera coleta conforme os mesmo aparecerem
let lista = [];

//Função principal, roda ao subimitar o formulario
function validacoes(event) {
    event.preventDefault();
    event.stopPropagation();

    limparErros();
    valEmail("#email");
    valWebSite("#website");
    valDta("#dataini", "#datafim");
    valNome("#nome", "#sobrenome");
    atividades();
    radioRegiao();
    if(lista.length > 0){
        modalErros(); 
    }
    else {
        formEnviado();
    }              
}

//Valida os campos nome seguindo as regras
function valNome(Nome, Sobrenome) {
    let nome = document.querySelector(Nome).value;
    let sobreNome = document.querySelector(Sobrenome).value;
    if(nome.length < 3) {
        mostrarErro("#nome")
        coletaErros("Campo Nome deve ter mais de 3 caracteres")
    }
    if(sobreNome.length < 3) {
        mostrarErro("#sobrenome")
        coletaErros("Campo Sobre Nome deve ter mais de 3 caracteres")
    }
}

//Valida o campo email seguindo as regras
function valEmail(elemento) {
    let email = document.querySelector(elemento).value;
    if(email.includes("@") && email.includes(".")) {
        let indiceArroba = email.indexOf("@");
        if(email.substr(indiceArroba, email.length).includes(".") != true) {
            coletaErros("Campo Email incorreto")
            return mostrarErro("#email")
        }                             
    }
    else {
        coletaErros("Campo Email precisa ser preenchido")
        return mostrarErro("#email")            
    }
}

//Primeiro verifica se o campo website foi preenchido em seguida valida de acordo com as regras
function valWebSite(elemento) {  
    let campoWeb = document.querySelector(elemento);
    if(campoWeb.value != null && campoWeb.value != "") { 
        console.log(campoWeb.value);          
        let web = campoWeb.value;
        if(web.includes("https://") && web.includes(".") && web.indexOf(".") > web.indexOf("https://")) {
            console.log("Website validado")
            return                
        }
        else {
            console.log("Website incorreto");
            coletaErros("Campo Website incorreto")  
            return mostrarErro("#website");                 
        }
    }
    console.log("Website nulo");  
}

//Valida os campos data seguindo as regras
function valDta(dtaInicial, dtaFinal) {
    let dataIniInput = document.querySelector(dtaInicial);
    let dataFimInput = document.querySelector(dtaFinal);
    let dataIni = new Date(dataIniInput.value);
    let dataFim = new Date(dataFimInput.value);
    if(dataFim > 0 && dataIni > 0) {
        if (dataFim <= dataIni) {
            coletaErros("Campo Data Final não pode ser menor ou igual ao campo Data Inicial")
            mostrarErro("#data")                
        }
    }
    else {
        coletaErros("Campos Data precisam ser preenchidos")
        mostrarErro("#data")  
    }
}

//Desabilita as atividades DBA e Programador caso a região Centro-Oeste seja selecionada
function radioRegiao() {
    let regiao = document.querySelector("input[name='regiao']:checked");
    if(regiao != null) {
        if(regiao.value === "centro-oeste") {
            let programador = document.querySelector("#programador")
            let dba = document.querySelector("#dba")
            programador.checked = false;
            dba.checked = false;
            programador.disabled = true;
            dba.disabled = true;
        }
        else {
            document.querySelector("#programador").disabled = false;
            document.querySelector("#dba").disabled = false;
        }
    }
    else if(regiao === null) {
        console.log("Regiao nulo")
        coletaErros("Precisa selecionar uma região")
        mostrarErro("#regiao")
    }
}


//Primeiro valida se foi escolhido pelo menos uma atividade, depois valida a quantidade(que não pode passar de 3)
function atividades() {
    let listaAtividades = document.querySelectorAll("input[name='atividade']:checked").length;            
    if(listaAtividades === 0){
        coletaErros("Precisa selecionar uma atividades")
        mostrarErro("#atividades")
        console.log("Selecione pelo menos 1")
    }
    else if(listaAtividades > 3) {
        coletaErros("Maximo de atividades é 3")
        console.log("O maximo são 3")
        mostrarErro("#atividades")
    }
}

//Essa função destaca de vermelho os campos com erro 
function mostrarErro(elemento) {
    document.querySelector(elemento).style.border = "1px solid #FF0F0F";
}

//Efetua limpeza dos campos com erro e mensagens de erro ao submitar
function limparErros() {
    const elementos = ["#nome", "#website", "#sobrenome", "#email", "#datafim", "#dataini", "#regiao", "#atividades"];
    elementos.forEach(elemento => mostrarErro(elemento,''));
    elementos.forEach(elemento => document.querySelector(elemento).style.border = "1px solid #0F0F0F")
    document.querySelector("#textoModalErros").innerHTML = ``
    lista = [];
}

//Efetua reset dos campos ao clicar no botão reiniciar
function reinicia() {
    limparErros();
    document.querySelectorAll(".reinicia").forEach(elemento => elemento.value = "");    
    document.querySelector("#programador").disabled = false;
    document.querySelector("#dba").disabled = false;
    document.querySelectorAll("input[name='atividade']:checked").forEach(elemento => elemento.checked = false)
    document.querySelector("input[name='regiao']:checked").checked = false
}

//Coleta as mensagens de erro e joga na lista
function coletaErros(mensagem){
    lista.push(mensagem);
}

//Coleta as mensagens ja na lista e depois joga na tag <dialog>
function modalErros() {
    for(x = 0; x <= lista.length - 1; x ++){
        document.querySelector("#textoModalErros").innerHTML += `
        <ul>
            <li>${lista[x]}</li>
        </ul>
        `
    }    
    document.querySelector("#modalErros").showModal();
}

//Abre popup do botão ajuda
function abrePopupModal() {
    document.querySelector("#textoModal").innerHTML = `
    <h3>Ajuda</h3>
    <p>Ola, seja bem vindo, segue abaixo as regras para preenchimento do formulario</p>
    <ol>
      <li>Nome e Sobre Nome devem ter mais de 3 caracteres</li>
      <li>Data Inicial deve ser menor que a Data Final</li>
      <li>Ao selecionar a região Centro-oeste as seguintes atividades serão desabilitadas: Programador e DBA</li>
      <li>Deve selecionar pelo 1 uma atividade e o maximo são 3</li>
      <li>Website é o unico campo não obrigatório, mas caso desejar inseri deve ser um websitw valido</li>
      <li>Os campos com informações invalidas vão ser marcados em vermelho</li>
    </ol>
    `
    document.querySelector("#modal").showModal();    
}

//Abre popup informando que o formulario foi enviado com sucesso
function formEnviado() {
    document.querySelector("#textoModalEnviado").innerHTML = `
    <h3>Formulario Enviado</h3>
    <p>Ola, seu formulario foi enviado com sucesso, logo nossa equipe de RH ira analisar seus dados e entrara em contato</p>    
    <p>Desejamos boa sorte!!</p>    
    `
    document.querySelector("#modalEnviado").showModal();    
}

//Fecha popup Enviado
function fechaPopupModalEnviado() {
    document.querySelector("#modalEnviado").close();
    reinicia();
}

//Fecha popup Ajuda
function fechaPopupModal() {
    document.querySelector("#modal").close();
}

//Fecha popup Erros
function fechaPopupModalErro() {
    document.querySelector("#modalErros").close();
}