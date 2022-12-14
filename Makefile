FORCE:

all:
	make clean
	yarn
	make check

publish:
	expo publish

p:
	@make publish

check:
	yarn list | rg "react@17"
	yarn list | rg "react@18"

clean:
	rm -rf node_modules

get-turtler:
	cp $$HOME/dots/personal/.secrets/sunnus/build turtler

cp:
	@make get-turtler

ios:
	@make get-turtler
	./turtler ios
	rm turtler

ios-dep:
	@make get-turtler
	./turtler ios-dep
	rm turtler

i:
	@make ios

i-dep:
	@make ios-dep

android:
	@make get-turtler
	./turtler android
	rm turtler

a:
	@make android
