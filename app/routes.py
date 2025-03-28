from flask import Blueprint, render_template, redirect, url_for

bp = Blueprint('main', __name__)

@bp.route('/')
def home():
    return render_template('home.html')

@bp.route('/game')
def game():
    return render_template('game.html')

@bp.route('/win')
def win():
    return render_template('win.html')

@bp.route('/lose')
def lose():
    return render_template('lose.html')
